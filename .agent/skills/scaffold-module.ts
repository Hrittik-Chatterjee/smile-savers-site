/**
 * Agent Skill: Module Generator (Astro 6)
 * Role: Automates the creation of new feature-based modules.
 */

interface ScaffoldResult {
    directories: string[];
    files: Array<{ path: string; content?: string; instructions?: string }>;
    principles: string[];
}

export const logic = {
    scaffold: (name: string): ScaffoldResult => {
        return {
            directories: [
                `src/modules/${name}`,
                `src/modules/${name}/components`,
                `src/modules/${name}/layouts`,
                `src/modules/${name}/pages`,
            ],
            files: [
                {
                    path: `src/modules/${name}/${name}.astro`,
                    content: "---\n// Module Entry Point\n---",
                },
                {
                    path: `src/content/config.ts`,
                    instructions: `Inject ${name} schema into collections.`,
                }
            ],
            principles: [
                "Zero-JS interactions",
                "Tailwind 4 CSS-First styling",
                "Astro 6 Content Layer integration"
            ]
        };
    }
};
