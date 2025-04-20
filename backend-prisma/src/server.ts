import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Schema de validação para criação de startup
const createStartupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slogan: z.string().min(1, 'Slogan é obrigatório'),
  description: z.string().optional(),
  foundingYear: z.number().int().min(1900).max(new Date().getFullYear()),
});

type CreateStartupInput = z.infer<typeof createStartupSchema>;

// Rota para criar uma startup
app.post('/api/startups', async (req, res) => {
  try {
    const data = createStartupSchema.parse(req.body);

    // 1. Cria startup
    const startup = await prisma.startup.create({
      data: {
        ...data,
        score: 70,
      }
    });

    // 2. Busca ou cria um torneio ativo
    let tournament = await prisma.tournament.findFirst({
      where: { isCompleted: false },
    });

    if (!tournament) {
      tournament = await prisma.tournament.create({
        data: {},
      });
    }

    // 3. Cria participação da startup no torneio
    await prisma.tournamentParticipation.create({
      data: {
        startupId: startup.id,
        tournamentId: tournament.id,
      },
    });

    res.status(201).json(startup);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error('Erro ao criar startup:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});


// Rota para criar uma startup de teste
app.post('/api/startups/test', async (_req, res) => {
  try {
    const testStartup = await prisma.startup.create({
      data: {
        name: "Teste",
        slogan: "Slogan de teste",
        description: "Descrição de teste",
        foundingYear: 2020,
        score: 70,
      }
    });
    
    console.log(`Startup de teste criada:`, testStartup);
    res.status(201).json(testStartup);
  } catch (error) {
    console.error('Erro ao criar startup de teste:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar todas as startups
app.get('/api/startups', async (_req, res) => {
  try {
    const startups = await prisma.startup.findMany({
      include: {
        participations: true
      }
    });
    res.json(startups);
  } catch (error) {
    console.error('Erro ao listar startups:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Rota para verificar se uma startup já existe pelo nome
app.get('/api/startups/check/:name', async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`Verificando startup com nome: "${name}"`);
    
    const startup = await prisma.startup.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive' // Case insensitive search
        }
      }
    });
    
    console.log(`Resultado da busca:`, startup ? `Encontrada: ${startup.name}` : 'Não encontrada');
    
    if (startup) {
      res.json({ exists: true, startup });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Erro ao verificar startup:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Rota para salvar os resultados finais do torneio
app.post('/api/tournament/finalize', async (req, res) => {
  const participations = req.body;

  try {
    const updates = await Promise.all(participations.map(async (p: any) => {
      return prisma.tournamentParticipation.upsert({
        where: {
          tournamentId_startupId: {
            tournamentId: p.tournamentId,
            startupId: p.startupId,
          },
        },
        update: {
          finalPosition: p.finalPosition,
          finalScore: p.finalScore,
          finalPitches: p.finalPitches,
          finalBugs: p.finalBugs,
          finalTractions: p.finalTractions,
          finalAngryInvestors: p.finalAngryInvestors,
          finalFakeNews: p.finalFakeNews,
        },
        create: {
          tournamentId: p.tournamentId,
          startupId: p.startupId,
          finalPosition: p.finalPosition,
          finalScore: p.finalScore,
          finalPitches: p.finalPitches,
          finalBugs: p.finalBugs,
          finalTractions: p.finalTractions,
          finalAngryInvestors: p.finalAngryInvestors,
          finalFakeNews: p.finalFakeNews,
        },
      });
    }));

    res.status(200).json({ message: 'Histórico salvo com sucesso', updates });
  } catch (error) {
    console.error('Erro ao salvar histórico do torneio:', error);
    res.status(500).json({ error: 'Erro ao salvar histórico do torneio' });
  }
});

app.post('/api/tournaments', async (req, res) => {
  try {
    const tournament = await prisma.tournament.create({
      data: {} // você pode incluir outros campos, se quiser
    });

    res.status(201).json(tournament);
  } catch (error) {
    console.error('Erro ao criar torneio:', error);
    res.status(500).json({ error: 'Erro ao criar torneio' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 
