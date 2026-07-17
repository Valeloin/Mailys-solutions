#!/bin/sh
# ============================================================
# Hook « post-commit » optionnel — met à jour CHANGELOG.md tout seul.
# Ajoute le dernier commit (heure + message) sous la 1re section
# « ## Session — … » du journal, puis l'inclut dans le commit.
#
# ACTIVER (une fois, dans Git Bash à la racine du projet) :
#     cp scripts/changelog-hook.sh .git/hooks/post-commit
#     chmod +x .git/hooks/post-commit
#
# DÉSACTIVER :
#     rm .git/hooks/post-commit
# ============================================================
LOCK=".git/.changelog.lock"
[ -e "$LOCK" ] && exit 0
: > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

CL="CHANGELOG.md"
[ -f "$CL" ] || exit 0

SUBJ=$(git log -1 --pretty=format:'%s')
TIME=$(git log -1 --date=format:'%H:%M' --pretty=format:'%ad')
ENTRY="- **$TIME** — $SUBJ"

# Insère l'entrée juste après la 1re ligne « ## Session — ».
awk -v entry="$ENTRY" '
  /^## Session —/ && !done { print; print ""; print entry; done=1; next }
  { print }
' "$CL" > "$CL.tmp" 2>/dev/null && mv "$CL.tmp" "$CL"

# Rien inséré (pas de section Session) → on ne touche à rien.
git diff --quiet -- "$CL" 2>/dev/null && exit 0

git add "$CL"
git commit --amend --no-edit --no-verify >/dev/null 2>&1
exit 0
