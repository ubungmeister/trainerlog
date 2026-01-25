import type { Exercise, Category } from "types/tableType";

export interface CategoryGroup {
  categoryId: string | null;
  title: string;
  count: number;
  exercises: Exercise[];
}

export function groupExercisesByCategory(
  exercises: Exercise[],
  categories: Category[],
): CategoryGroup[] {
  // 1. Group exercises by categoryId (or null)
  const groups = new Map<string | null, Exercise[]>();

  for (const ex of exercises) {
    const key = ex.categoryId ?? null;
    const list = groups.get(key) ?? [];
    list.push(ex);
    groups.set(key, list);
  }

  // 2. Build result sections for categories (sorted by name)
  const result: CategoryGroup[] = [];

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  for (const cat of sortedCategories) {
    const list = groups.get(cat.id) ?? []; // Include empty categories

    result.push({
      categoryId: cat.id,
      title: cat.name,
      count: list.length,
      exercises: list,
    });
  }

  // 3. Add Uncategorized at the end
  const uncategorized = groups.get(null);
  if (uncategorized?.length) {
    result.push({
      categoryId: null,
      title: "Uncategorized",
      count: uncategorized.length,
      exercises: uncategorized,
    });
  }

  return result;
}
