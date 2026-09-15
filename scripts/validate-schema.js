const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260915_001_production_schema.sql');
const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');

function stripComments(sql) {
  // Remove single line comments --
  let lines = sql.split('\n');
  lines = lines.map(line => {
    // If not inside a string, remove after --
    let inStr = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "'" && (i === 0 || line[i - 1] !== '\\')) inStr = !inStr;
      if (!inStr && line[i] === '-' && line[i + 1] === '-') {
        return line.slice(0, i);
      }
    }
    return line;
  });
  return lines.join('\n');
}

function validateFile(filePath, isSeed = false) {
  console.log(`\nValidating: ${path.basename(filePath)}...`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  const rawSql = fs.readFileSync(filePath, 'utf8');
  const sql = stripComments(rawSql);

  // Check balanced parentheses
  let parenDepth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inDollarQuote = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prev = i > 0 ? sql[i - 1] : '';

    if (char === "'" && !inDoubleQuote && !inDollarQuote && prev !== '\\') {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote && !inDollarQuote && prev !== '\\') {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === '$' && sql[i + 1] === '$' && !inSingleQuote && !inDoubleQuote) {
      inDollarQuote = !inDollarQuote;
      i++; // skip next $
    } else if (!inSingleQuote && !inDoubleQuote && !inDollarQuote) {
      if (char === '(') parenDepth++;
      else if (char === ')') parenDepth--;
      if (parenDepth < 0) {
        throw new Error(`Unbalanced closing parenthesis around character ${i}`);
      }
    }
  }

  if (parenDepth !== 0) {
    throw new Error(`Unbalanced parentheses! Ending depth: ${parenDepth}`);
  }
  if (inSingleQuote) throw new Error('Unclosed single quote detected');
  if (inDoubleQuote) throw new Error('Unclosed double quote detected');
  if (inDollarQuote) throw new Error('Unclosed dollar quote detected');

  console.log('✓ Syntax & delimiters balanced');

  if (!isSeed) {
    const requiredTables = [
      'users',
      'user_profiles',
      'curriculum_tracks',
      'curriculum_modules',
      'user_progress',
      'user_streaks',
      'user_tasks',
      'user_notes',
      'saved_recall_items',
      'user_settings',
      'ats_analysis_history',
      'ai_conversations',
      'ai_messages'
    ];

    requiredTables.forEach((table) => {
      const regex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\b`, 'i');
      if (!regex.test(sql)) {
        throw new Error(`Missing table definition: public.${table}`);
      }
      console.log(`✓ Table found: public.${table}`);
    });

    // Check RLS
    requiredTables.forEach((table) => {
      const rlsRegex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, 'i');
      if (!rlsRegex.test(sql)) {
        throw new Error(`RLS not enabled on table: public.${table}`);
      }
    });
    console.log(`✓ Row Level Security verified on all ${requiredTables.length} tables`);

    // Check required indexes
    const indexChecks = [
      'idx_users_firebase_uid',
      'idx_user_profiles_user_id',
      'idx_curriculum_modules_track_id',
      'idx_user_progress_module_id',
      'idx_user_progress_is_completed',
      'idx_user_progress_created_at',
      'idx_user_progress_updated_at'
    ];

    indexChecks.forEach((idx) => {
      if (!sql.includes(idx)) {
        throw new Error(`Missing expected index: ${idx}`);
      }
      console.log(`✓ Index verified: ${idx}`);
    });
  } else {
    // Validate seed
    if (!sql.includes('INSERT INTO public.curriculum_tracks')) {
      throw new Error('Seed missing curriculum_tracks insertion');
    }
    if (!sql.includes('INSERT INTO public.curriculum_modules')) {
      throw new Error('Seed missing curriculum_modules insertion');
    }
    console.log('✓ Seed tracks and module inserts verified');
  }
}

try {
  validateFile(schemaPath);
  validateFile(migrationPath);
  validateFile(seedPath, true);
  console.log('\n=========================================');
  console.log('ALL DATABASE SCHEMA & SEED TESTS PASSED!');
  console.log('=========================================\n');
} catch (err) {
  console.error('\n❌ VALIDATION ERROR:', err.message);
  process.exit(1);
}
