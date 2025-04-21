import express, { Request, Response } from 'express';
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

app.get('/teste', (req, res) => {
  res.send('Servidor está funcionando!');
});


// Rota para criar uma startup
app.post('/api/startups', async (req: Request, res: Response) => {
  try {
    const data = createStartupSchema.parse(req.body);

    const startup = await prisma.startup.create({
      data: {
        ...data,
        score: 70,
      }
    });

    let tournament = await prisma.tournament.findFirst({
      where: { isCompleted: false },
    });

    if (!tournament) {
      tournament = await prisma.tournament.create({ data: {} });
    }

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
app.post('/api/startups/test', async (_req: Request, res: Response) => {
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

    res.status(201).json(testStartup);
  } catch (error) {
    console.error('Erro ao criar startup de teste:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar todas as startups
app.get('/api/startups', async (_req: Request, res: Response) => {
  try {
    const startups = await prisma.startup.findMany({
      include: { participations: true }
    });
    res.json(startups);
  } catch (error) {
    console.error('Erro ao listar startups:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para verificar se uma startup já existe pelo nome
app.get('/api/startups/check/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    const startup = await prisma.startup.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

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

// ✅ Rota para buscar uma startup por ID
app.get('/api/startups/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const startup = await prisma.startup.findUnique({
      where: { id },
      include: {
        participations: true,
      },
    });

    if (!startup) {
      res.status(404).json({ error: 'Startup não encontrada' });
      return;
    }

    res.json(startup);
  } catch (error) {
    console.error('Erro ao buscar startup por ID:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// Rota para salvar os resultados finais do torneio
app.post('/api/tournament/finalize', async (req: Request, res: Response) => {
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

// Rota para criar um novo torneio
app.post('/api/tournaments', async (_req: Request, res: Response) => {
  try {
    const tournament = await prisma.tournament.create({
      data: {}
    });

    res.status(201).json(tournament);
  } catch (error) {
    console.error('Erro ao criar torneio:', error);
    res.status(500).json({ error: 'Erro ao criar torneio' });
  }
});

// Rota para buscar participações de uma startup por ID
app.get('/api/startups/:id/participations', async (req, res) => {
  const { id } = req.params;

  try {
    const participations = await prisma.tournamentParticipation.findMany({
      where: {
        startupId: id,
        finalPosition: {
          not: null // ← Apenas participações finalizadas
        }
      },
      orderBy: {
        finalPosition: 'asc'
      },
      include: {
        tournament: true // ← caso queira usar dados do torneio no front
      }
    });

    res.json(participations);
  } catch (error) {
    console.error('Erro ao buscar participações da startup:', error);
    res.status(500).json({ error: 'Erro interno ao buscar histórico de participações' });
  }
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
