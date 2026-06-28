import Image from "next/image";

// Small stacked-avatar cluster shown in the marketing panel as social proof.
// Uses Clerk's public demo avatars (img.clerk.com is already allowlisted in
// next.config.ts).
const profiles = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeHhsNWc5WW9QTGpTbjc5ejN3aXAwTDJNSHUifQ",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yeHhCR2J5dTlUYWswM3RjOU5aWExkTFluSEYifQ",
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeGd5aDNER1JCaTR5YWpsRERJQzhnSzV2MHcifQ",
  },
  {
    id: 4,
    name: "David Wilson",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yc3FhdFEwWUU3WXRBZ1B5aEN5VmJld3JjUjkifQ",
  },
  {
    id: 5,
    name: "Emma Brown",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yb2xFaUxoWUEzRVRvRzZVNFlpc2duVzRoWE8ifQ",
  },
];

export default function ProfileOverlay() {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-4">
        {profiles.map((profile, index) => (
          <Image
            key={profile.id}
            src={profile.avatar}
            alt={profile.name}
            width={48}
            height={48}
            className={`h-12 w-12 rounded-full border-2 border-white shadow-lg ${
              index === 0 ? "hidden md:block" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
