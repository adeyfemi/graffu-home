// The sheet's `image` column is a filename in $lib/assets/story-screenshots, or a full URL.
const screenshots = import.meta.glob<string>('$lib/assets/story-screenshots/*', {
	eager: true,
	import: 'default'
});

export function screenshotFor(image: string | undefined): string | undefined {
	if (!image) return undefined;
	if (/^https?:\/\//.test(image)) return image;
	return screenshots[`/src/lib/assets/story-screenshots/${image}`];
}
