I have analyzed the requirements and the current codebase. Here is the plan to modify the logic and database interaction as requested.

### 1. Modify Data Access Logic (`apps/web-next/lib/db.ts`)

* **Update** **`getImageDetail`**:

  * Change the Supabase query to join the `reference_images` table instead of selecting the `reference_image` column.

  * Transform the result to map the array of objects (e.g., `[{ url: '...' }]`) back to a simple array of strings (`['...']`) to maintain compatibility with the frontend.

* **Verify** **`listImages`**:

  * Confirm that `listImages` does *not* query reference images (current implementation already satisfies this, but I will ensure it remains so).

### 2. Update Data Ingestion Script (`apps/web-next/scripts/seed-oss-db.mjs`)

* **Enforce New Schema**:

  * Modify the seeding script to stop trying to insert into the `reference_image` array column on the `images` table.

  * Instead, always insert image data first, then insert related records into the `reference_images` table. This ensures all new data follows the one-to-many relationship structure and metadata is correctly stored in the backend database.

### 3. Verification

* **API Response**: Verify that `/api/images/[id]` returns the correct JSON structure with `reference_image` as an array of URLs.

* **Frontend Behavior**: Ensure `ImageDetailModal` correctly displays reference images when opened, and the main list does not fetch them.

