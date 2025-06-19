# Screenshots Folder

This folder contains product screenshots for the AI Hype or Not website.

## Structure

- `placeholder.svg` - Default placeholder image used when no actual screenshot is available
- Product-specific screenshots should be named following the pattern: `{product-slug}-{screenshot-number}.{extension}`

## Naming Convention

For actual product screenshots, use the following naming pattern:
- `cursor-1.jpg` - First screenshot for Cursor
- `cursor-2.png` - Second screenshot for Cursor
- `windsurf-1.jpg` - First screenshot for Windsurf
- etc.

## Supported Formats

- JPG/JPEG
- PNG
- WebP
- SVG

## Recommended Dimensions

- Width: 500-800px
- Height: 300-600px
- Aspect ratio: 16:9 or 4:3 recommended

## Database Integration

Screenshots are referenced in the `product_screenshots` table with the `image_url` field pointing to `/screenshots/{filename}`.

Example:
```sql
INSERT INTO product_screenshots (product_id, image_url, caption, display_order) VALUES
(1, '/screenshots/cursor-1.jpg', 'Cursor Editor Interface', 1);
```