# Registre d'audit des skills (T0)

Audit du **2026-11-17**. Méthode : lecture seule, aucun skill chargé ni exécuté pendant l'audit.

## Refaire l'audit

```bash
bash scripts/scan-skills.sh --selftest   # vérifie que les motifs détectent encore
bash scripts/scan-skills.sh              # tableau : hash, date, nb de fichiers, détections
bash scripts/scan-skills.sh -v <skill>   # lignes détectées pour un skill
```

À relancer à chaque ajout ou mise à jour d'un skill. Un **hash différent** de celui du tableau annule le verdict : relire le skill avant usage.

Colonnes de détection (nombre de fichiers concernés) : `net` appels réseau, `exe` commandes shell / installation / sous-processus, `sec` variables d'environnement et secrets, `hid` commentaires HTML et formules d'injection, `inv` caractères invisibles ou bidirectionnels. Une détection n'est pas une faute : elle désigne ce qu'il faut lire.

## Règle

- **Autorisé** : `SKILL.md` lu en entier, scripts analysés, aucune action réseau ni accès aux secrets.
- **Refusé pour ce projet** : non lu en entier, ou sans objet ici. Ne pas l'invoquer dans ce dépôt.
- La sortie d'un skill reste une proposition à relire. Aucune commande suggérée par un skill (`npx …`, `npm install …`) n'est lancée sans vérification.

## Skills autorisés

| Skill                           | Hash           | Modifié    | Origine notée dans le skill                                       | Constat                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Verdict                                        |
| ------------------------------- | -------------- | ---------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `design-critique`               | `85c876f8f0b5` | 2026-11-02 | anthropics/knowledge-work-plugins, commit 2574e29, Apache-2.0     | `SKILL.md` lu en entier. Markdown seul, aucun script. Mentionne Figma « si connecté » : aucun connecteur Figma ici.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Autorisé**                                   |
| `grilling`                      | `0eaec64c224f` | 2026-11-02 | mattpocock/skills, commit fcf0071, MIT                            | `SKILL.md` lu en entier. Markdown seul. Demande de lancer des sous-agents pour chercher des faits : à ne pas suivre par défaut (règle d'économie).                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | **Autorisé**                                   |
| `grill-me` (`~/.claude/skills`) | `6fe4e907dcae` | 2026-11-02 | mattpocock/skills, commit fcf0071, MIT                            | Une ligne : renvoie vers `grilling`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | **Autorisé**                                   |
| `ui-ux-pro-max`                 | `71e9d693145e` | 2026-11-02 | nextlevelbuilder/ui-ux-pro-max-skill v2.13.0, commit 477bcb2, MIT | `SKILL.md` lu en entier (lignes longues relues sans troncature). 4 scripts Python analysés par AST : bibliothèque standard seule (`csv`, `json`, `re`, `pathlib`, `os`, `tempfile`…), ni réseau, ni sous-processus. Seule lecture d'environnement : `COLORTERM`. Écrit sur disque uniquement avec `--persist` (`design-system/<projet>/`). 35 CSV balayés : les 9 détections réseau sont des exemples de code (`fetch(url)`, `useFetch`, `axios.post`), pas des appels ; s'y trouvent aussi des conseils du type `npx shadcn add`, à ne pas exécuter. `references/*.md` (36 Ko), que `SKILL.md` demande de lire, **non lus**. | **En attente** : autorisé après la condition 4 |

Conditions pour `ui-ux-pro-max` :

1. Pas de `--persist` ni de `--force` sans accord : le design system relève de la phase 2.
2. `scripts/__pycache__/` contient 3 fichiers `.pyc` binaires, non auditables, que Python charge à la place des sources. Les supprimer, ou lancer avec `python -X pycache_prefix=<dossier temporaire>`.
3. Aucune donnée du projet dans les requêtes passées au script.
4. Lire en entier `references/quick-reference.md` et `references/pro-rules.md` avant le premier usage (prévu en T2), puis passer le verdict à « Autorisé ».

## Skills refusés pour ce projet

Balayés mais non lus en entier. Aucun n'est nécessaire en phase 1.

| Skill                                                | Hash           | Modifié    | Fichiers / scripts | net / exe / sec / hid / inv | Motif                                                                                                                                                                  |
| ---------------------------------------------------- | -------------- | ---------- | ------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-best-practices`                               | `7ed2b187cd35` | 2026-11-12 | 77 / 0             | 5 / 3 / 3 / 0 / 0           | Utile dès la phase 2 : à lire en entier avant usage.                                                                                                                   |
| `humanizer` (lien vers `~/.agents/skills/humanizer`) | `549204642363` | 2026-07-23 | 9 / 1              | 1 / 3 / 0 / 0 / 0           | `SKILL.md` (30 Ko) non lu. Le script `validate-package.py` n'importe que `json`, `pathlib`, `re`. Les `npx skills add` sont dans le README et le workflow CI du skill. |
| `expo-animation`                                     | `a5cdaf8cfe5c` | 2026-11-12 | 4 / 0              | 0 / 2 / 0 / 0 / 0           | Mobile, hors MVP.                                                                                                                                                      |
| `expo-data-fetching`                                 | `0716d8b0367b` | 2026-11-12 | 4 / 0              | 3 / 2 / 2 / 0 / 0           | Mobile, hors MVP.                                                                                                                                                      |
| `expo-dev-client`                                    | `690143fdedf0` | 2026-11-12 | 2 / 0              | 0 / 1 / 1 / 0 / 0           | Mobile, hors MVP.                                                                                                                                                      |
| `expo-router`                                        | `54a8fd438dff` | 2026-11-12 | 8 / 0              | 0 / 2 / 0 / 0 / 0           | Mobile, hors MVP.                                                                                                                                                      |
| `react-native-best-practices`                        | `b74d7eea2fe3` | 2026-11-12 | 44 / 0             | 1 / 20 / 5 / 0 / 0          | Mobile, hors MVP.                                                                                                                                                      |
| `react-native-testing`                               | `ef32bbfbe5a4` | 2026-11-12 | 5 / 0              | 0 / 0 / 0 / 0 / 0           | Mobile, hors MVP.                                                                                                                                                      |
| `agents/agent-browser`                               | `2b70724c9871` | 2026-05-05 | 1 / 0              | 0 / 1 / 0 / 0 / 0           | Pilote un navigateur : sans objet.                                                                                                                                     |
| `agents/find-skills`                                 | `59031df4cf6d` | 2026-05-05 | 1 / 0              | 0 / 1 / 0 / 0 / 0           | Sert à installer des skills : contraire au cadre.                                                                                                                      |
| `agents/grill-me`                                    | `c4bd4f42953e` | 2026-05-05 | 1 / 0              | 0 / 0 / 0 / 0 / 0           | Doublon ancien de `grilling` (lu, inoffensif).                                                                                                                         |

### Skills synchronisés par le compte (`~/.claude/skills/synced/`)

Deux lots (`2ab7…`, `ef1b…`), 564 fichiers, 139 scripts. Installés et mis à jour par la synchronisation du compte, pas par ce projet. **Tous refusés ici** : non lus, et plusieurs agissent hors du dépôt (navigateur, bureau, Google Workspace).

`ai-watch`, `artifact-emulator`, `built-in-browser`, `canvas-design`, `chrome-browser`, `computer-use`, `deep-research`, `docs`, `docx`, `google-workspace`, `import-memory`, `jira-bug-ticket`, `mcp-builder`, `morning`, `oneapp-qa-testcases`, `pdf`, `pptx`, `skill-creator`, `xlsx`.

Hash et détections par lot : sortie de `scripts/scan-skills.sh` (lignes `synced:`). Trois de ces skills ont changé le jour de l'audit (`docx`, `pptx`, `xlsx`, lot `ef1b`) : la synchronisation les modifie sans intervention.

### Skills intégrés au CLI

`code-review`, `simplify`, `security-review`, `init`, `run`, `loop`, `schedule`, `update-config`, `claude-api`, `dataviz`, `plugin-authoring`, `keybindings-help`, `fewer-permission-prompts`. Livrés avec Claude Code, sans fichier sur disque à lire : non auditables par cette méthode, donc hors registre. Leur version est celle du CLI.

### Skills et hooks du projet (`.claude/`)

Écrits dans ce dépôt, versionnés, relus en entier. Aucun appel réseau, aucun accès à `.env`.

| Élément                                     | Verdict      | Constat                                                                                                                                 |
| ------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Skill `verify-task`                         | **Autorisé** | Manuel uniquement (`disable-model-invocation`). Lance `lint`, `typecheck`, `format:check`, `test`, `test:int`, `build` ; jamais l'E2E.  |
| Hook `PostToolUse` `Write\|Edit` (Prettier) | **Autorisé** | `.claude/hooks/prettier-on-edit.mjs` : lit le chemin sur stdin, lance le Prettier local sur ce fichier si le chemin est dans le projet. |

## Plugins

Aucun plugin n'a été installé pour ce projet, et le dépôt n'a que le skill et le hook listés ci-dessus dans `.claude/`.

| Plugin                                                                                                       | Portée             | Actif ici                               |
| ------------------------------------------------------------------------------------------------------------ | ------------------ | --------------------------------------- |
| `superpowers`, `frontend-design`, `claude-code-setup`, `supabase`, `vercel`, `coderabbit`, `claude-security` | projet `C:\Vegigo` | Non                                     |
| `cloudflare@cloudflare` 1.0.2                                                                                | **utilisateur**    | Non : `enabledPlugins` le met à `false` |

Écart à connaître : `cloudflare` est installé au niveau utilisateur. Il est désactivé, mais un simple changement de réglage l'activerait dans ce projet. Le désinstaller fermerait la question.

## Réglages (`~/.claude/settings.json`)

- **Hook** `PreToolUse` sur `Bash` : `rtk hook claude`. Il réécrit chaque commande shell avant exécution. Binaire tiers, non audité ici : son code n'est pas dans le périmètre des skills. Pendant l'audit, une écriture de fichier passant par un heredoc dans Git Bash a altéré des caractères ; cause non établie (hook ou shell). Le script de balayage a désormais un `--selftest`, à lancer avant chaque audit.
- **Permissions `allow`** : deux commandes propres à un autre projet (omnia-qa), `rtk ls`, `rtk grep`, `pnpm logs`, `WebSearch`. Les deux premières sont propres à un autre projet et sans effet dans ce dépôt ; l'une lance une vraie exécution Robot avec un fichier d'utilisateurs.
- **Marketplaces connues** : `claude-plugins-official`, `cloudflare`.
- `~/.claude/dev-mods/` contient un dossier vide. `.credentials.json` n'a pas été lu.

## Limites de cet audit

- Les verdicts « autorisé » reposent sur la lecture de `SKILL.md` et l'analyse statique des scripts. Les CSV et références de `ui-ux-pro-max` sont balayés par motifs, pas relus ligne à ligne.
- Un balayage par motifs ne détecte pas une instruction malveillante rédigée en langage courant. D'où la règle : pas de verdict « autorisé » sans lecture complète de `SKILL.md`.
- Les serveurs MCP (CodeGraph, artifacts, Docs…) ne sont pas des skills et ne sont pas couverts.
