import { describe, it, expect } from "vitest";
import { sortArticles } from "./index";
import type { SpaceflightArticle } from "~/types";

describe("sortArticles", () => {
  const mockArticles: SpaceflightArticle[] = [
    {
      id: 1,
      title: "Zebra Mission Launch",
      summary: "A mission about zebras",
      image_url: "https://example.com/zebra.jpg",
      news_site: "Space News",
      published_at: "2024-01-15T10:00:00Z",
      url: "https://example.com/zebra",
    },
    {
      id: 2,
      title: "Alpha Space Station",
      summary: "A space station story",
      image_url: "https://example.com/alpha.jpg",
      news_site: "Space Today",
      published_at: "2024-01-20T15:30:00Z",
      url: "https://example.com/alpha",
    },
    {
      id: 3,
      title: "Beta Rocket Test",
      summary: "Testing a new rocket",
      image_url: "https://example.com/beta.jpg",
      news_site: "Rocket News",
      published_at: "2024-01-10T08:45:00Z",
      url: "https://example.com/beta",
    },
  ];

  it("sorts articles alphabetically by title when sortBy is 'title'", () => {
    const sorted = sortArticles(mockArticles, "title");

    expect(sorted).toHaveLength(3);
    expect(sorted[0].title).toBe("Alpha Space Station");
    expect(sorted[1].title).toBe("Beta Rocket Test");
    expect(sorted[2].title).toBe("Zebra Mission Launch");
  });

  it("sorts articles chronologically by date when sortBy is 'date' (newest first)", () => {
    const sorted = sortArticles(mockArticles, "date");

    expect(sorted).toHaveLength(3);
    expect(sorted[0].published_at).toBe("2024-01-20T15:30:00Z"); // Alpha - newest
    expect(sorted[1].published_at).toBe("2024-01-15T10:00:00Z"); // Zebra - middle
    expect(sorted[2].published_at).toBe("2024-01-10T08:45:00Z"); // Beta - oldest
  });

  it("returns a new array without mutating the original", () => {
    const originalOrder = [...mockArticles];
    const sorted = sortArticles(mockArticles, "title");

    expect(sorted).not.toBe(mockArticles);
    expect(mockArticles).toEqual(originalOrder);
  });

  it("handles empty array", () => {
    const sorted = sortArticles([], "title");
    expect(sorted).toEqual([]);
  });

  it("handles single article", () => {
    const singleArticle = [mockArticles[0]];
    const sorted = sortArticles(singleArticle, "date");

    expect(sorted).toHaveLength(1);
    expect(sorted[0]).toEqual(mockArticles[0]);
  });

  it("handles articles with identical titles when sorting by title", () => {
    const articlesWithDuplicateTitles: SpaceflightArticle[] = [
      {
        ...mockArticles[0],
        id: 1,
        title: "Same Title",
      },
      {
        ...mockArticles[1],
        id: 2,
        title: "Same Title",
      },
    ];

    const sorted = sortArticles(articlesWithDuplicateTitles, "title");
    expect(sorted).toHaveLength(2);
    expect(sorted[0].title).toBe("Same Title");
    expect(sorted[1].title).toBe("Same Title");
  });

  it("handles articles with identical dates when sorting by date", () => {
    const articlesWithSameDate: SpaceflightArticle[] = [
      {
        ...mockArticles[0],
        id: 1,
        published_at: "2024-01-15T10:00:00Z",
      },
      {
        ...mockArticles[1],
        id: 2,
        published_at: "2024-01-15T10:00:00Z",
      },
    ];

    const sorted = sortArticles(articlesWithSameDate, "date");
    expect(sorted).toHaveLength(2);
    expect(sorted[0].published_at).toBe("2024-01-15T10:00:00Z");
    expect(sorted[1].published_at).toBe("2024-01-15T10:00:00Z");
  });

  it("handles invalid date strings gracefully", () => {
    const articlesWithInvalidDate: SpaceflightArticle[] = [
      {
        ...mockArticles[0],
        published_at: "invalid-date",
      },
      {
        ...mockArticles[1],
        published_at: "2024-01-15T10:00:00Z",
      },
    ];

    // Should not throw an error
    expect(() => sortArticles(articlesWithInvalidDate, "date")).not.toThrow();

    const sorted = sortArticles(articlesWithInvalidDate, "date");
    expect(sorted).toHaveLength(2);
  });

  it("sorts case-insensitively for titles", () => {
    const articlesWithMixedCase: SpaceflightArticle[] = [
      {
        ...mockArticles[0],
        title: "zebra mission",
      },
      {
        ...mockArticles[1],
        title: "Alpha Station",
      },
      {
        ...mockArticles[2],
        title: "BETA rocket",
      },
    ];

    const sorted = sortArticles(articlesWithMixedCase, "title");
    expect(sorted[0].title).toBe("Alpha Station");
    expect(sorted[1].title).toBe("BETA rocket");
    expect(sorted[2].title).toBe("zebra mission");
  });
});
