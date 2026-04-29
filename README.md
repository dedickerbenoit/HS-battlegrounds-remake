# HS-battlegrounds-remake

## Le projet:

Je vous emmène avec moi dans la création d'un jeu que j'adore: **Hearthstone Battlegrounds**.

L'idée n'est pas de faire un clone pixel-perfect, mais de **reconstruire from scratch le moteur de jeu** qui fait tourner un auto-battler: la logique métier, la gestion d'état, le système de combat, le tout dans un environnement où 8 joueurs interagissent avec un pool de cartes partagé et fini.

Ce qui m'intéresse ici, ce n'est pas de refaire une jolie interface. C'est de m'attaquer à **des problèmes d'ingénierie que je n'ai jamais rencontrés** dans mes projets habituels.

## Pourquoi ce projet est-il différent ?

- **L'état vit entièrement en mémoire durant la partie**: pas de base de données.
- **8 joueurs partagent un pool de cartes fini.** Chaque achat, chaque vente, chaque mort affecte les probabilités de tous les autres.
- **Le hasard doit être déterministe.** Même seed = même partie.
- **Le moteur doit fonctionner sans interface.** Pour tester, je lance 1000 parties en headless. Pour jouer, j'y branche une UI.
- **La UI ne fetch pas des données: elle consomme une file d'événements.**

## Les défis techniques:

- **Pool de cartes partagés**
- **RNG déterministe**
- **Moteur de combat**
- **Ghost System**
- **Machine à états**
- **Backend temps réel (mode duo)**

## La Stack:

Le choix de la stack est guidé par une contrainte forte: **le moteur de jeu doit être une boite noire sans dépendance, testable et executable sans UI.**

- **Langage:** TypeScript: Typage fort sur le game state, un seul langage partout.
- **Runtime:** Node.js: Exécution headless, worker_threads pour la simulation batch.
- **Backend:** NestJS: Serveur webSocket pour le mode duo, architecture modulaire.
- **Monorepo:** pnpm workspaces: Séparation propre engine / simulation / UI.
- **Engine:** Fonctions pures, zéro dépendance.
- **RNG:** xoshiro256\*\* custom.
- **Tests:** Vitest: Rapide, support TS natif.
- **UI:** React + Zustand: Store decoupled, écosystème large.
- **Rendu combat:** Pixi.js (@pixi/react): Animations fluides pour les combats de cartes.
- **Build:** tsup (engine) + Vite (UI): Rapide, configuration minimale.

**Note personnelle :** Je n'ai jamais fait de backend en TypeScript ni utilisé NestJS. C'est un choix délibéré — ce projet est aussi l'occasion de sortir de ma zone de confort et de découvrir un framework backend structuré côté TypeScript.

## Avancement

- [x] Spécification des règles du jeu
- [x] Core types & runtime models
- [ ] GameState & machine à états
- [ ] Génération du shop (roll, freeze, refresh)
- [ ] Logique d'upgrade de taverne
- [ ] système de triple (fusion)
- [ ] Moteur de combat
- [ ] Résolution des dégâts & armure
- [ ] Ghost system
- [ ] Matchmaking
- [ ] Bots (stratégies simples)
- [ ] Simulation headless (batch testing)
- [ ] UI (React + Pixi.js)
- [ ] Mode solo (1 joueur vs 7 bots)
- [ ] Serveur WebSocket (Node.js/TS)
- [ ] Mode duo (2 joueurs vs 6 bots)

## Structure du projet

```
docs/
  GAME_RULES.md              # Spécification complète des règles
  devlog/                     # Journal de développement
    001-game-rules.md
    002-game-types-runtime-models.md
packages/
  engine/                     # Logique de jeu pure (zéro dépendance)
  simulation/                 # Runner de bots & tests en batch (à venir)
  server/                     # Backend WebSocket (mode duo)
  client/                         # Interface (découplage total avec l'engine)
```

## Devlog

Chaque système majeur fait l'objet d'une entrée dans le journal : le problème, les choix, les erreurs, les solutions.

001: Règles du jeu: docs/devlog/001-game-rules.md  
002: Typage du moteur & état de jeu: docs-devlog/002-game-types-runtime-models.md  
003: Pool de cartes (A venir)  
004: Moteur de combat (A venir)  
005: Ghost & matchmaking (A venir)  
006: Bots & simulation (A venir)  
007: Backend WebSocket & mode duo (A venir)

_J'utilise l'IA comme outil d'aide à la conception et à l'architecture. Tout le code, les décisions et la compréhension des systèmes sont les miens._
