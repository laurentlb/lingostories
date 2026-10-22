// pieceCount: number of puzzle pieces ($collect images + questions with an #ok
// answer). scripts/check_stories.cjs verifies it.
export const allStories = [
    { id: "grocery", title: "The Grocery List", pieceCount: 5,
        released: ["en", "fr", "nl", "sv", "de", "pl", "es", "ua", "ar", "zh", "it"]
    },
    { id: "park", title: "A Day in the Park", pieceCount: 5,
        released: ["en", "fr", "nl", "sv", "de", "pl", "pt", "es", "ua", "ar", "it"]
    },
    { id: "intro", title: "Introduction", pieceCount: 1,
        released: ["en", "fr", "nl", "sv", "de", "pl", "pt", "es", "ua", "ar"]
     },
    { id: "numbers", title: "A Game of Numbers", pieceCount: 0,
        released: false },
    { id: "restaurant", title: "At the Restaurant", pieceCount: 0,
        released: false },
    { id: "lost", title: "Lost & Found", pieceCount: 4,
        released: false },
    { id: "lesson1", title: "The Smith Family", pieceCount: 5,
        released: false },
    { id: "lesson2", title: "Ages", pieceCount: 7,
        released: false },
    { id: "lesson3", title: "The House", pieceCount: 6,
        released: false },
    { id: "lesson4", title: "Cities and Countries", pieceCount: 5,
        released: false },
    { id: "lesson5", title: "The Body", pieceCount: 9,
        released: false },
];
