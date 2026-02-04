/**
 * Smile Savers Flow - Tech Stack Validators
 * 
 * Verifies project configuration for Astro 6, Tailwind 4, and DaisyUI 5
 * 
 * @module orchestration/validators
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

interface ValidationResult {
    passed: boolean;
    checks: Array<{
        name: string;
        passed: boolean;
        message: string;
    }>;
}

export class StackValidator {
    private projectRoot: string;

    constructor(projectRoot: string = process.cwd()) {
        this.projectRoot = projectRoot;
    }

    /**
     * Validate entire tech stack
     */
    async validateAll(): Promise<ValidationResult> {
        const astro = await this.validateAstro();
        const tailwind = await this.validateTailwind();
        const daisy = await this.validateDaisyUI();

        return {
            passed: astro.passed && tailwind.passed && daisy.passed,
            checks: [...astro.checks, ...tailwind.checks, ...daisy.checks]
        };
    }

    /**
     * Validate Astro 6 configuration
     */
    async validateAstro(): Promise<ValidationResult> {
        const checks = [];
        let allPassed = true;

        // Check config file
        const hasConfig = existsSync(join(this.projectRoot, 'astro.config.mjs'));
        checks.push({
            name: 'Astro Config',
            passed: hasConfig,
            message: hasConfig ? 'astro.config.mjs found' : 'Missing astro.config.mjs'
        });
        if (!hasConfig) allPassed = false;

        // Check actions directory (Standard in Astro 6/Smile Savers)
        const hasActions = existsSync(join(this.projectRoot, 'src/actions'));
        checks.push({
            name: 'Astro Actions',
            passed: hasActions,
            message: hasActions ? 'src/actions directory found' : 'Missing src/actions directory'
        });

        // Check dependencies
        const pkg = this.getPackageJson();
        const astroVersion = pkg.dependencies?.astro || pkg.devDependencies?.astro || '0.0.0';
        const isV5Plus = parseInt(astroVersion.replace(/[^0-9.]/g, '').split('.')[0]) >= 5;

        checks.push({
            name: 'Astro Version',
            passed: isV5Plus,
            message: isV5Plus ? `Astro version ${astroVersion} (Compatible)` : `Astro version ${astroVersion} (Upgrade recommended)`
        });
        if (!isV5Plus) allPassed = false;

        return { passed: allPassed, checks };
    }

    /**
     * Validate Tailwind 4 configuration
     */
    async validateTailwind(): Promise<ValidationResult> {
        const checks = [];
        let allPassed = true;

        // Check CSS file for @theme
        const cssPath = join(this.projectRoot, 'src/styles/global.css');
        let hasTheme = false;

        if (existsSync(cssPath)) {
            const css = readFileSync(cssPath, 'utf-8');
            hasTheme = css.includes('@theme');
        }

        checks.push({
            name: 'Tailwind v4 @theme',
            passed: hasTheme,
            message: hasTheme ? '@theme directive found in global.css' : 'Missing @theme directive in global.css'
        });
        if (!hasTheme) allPassed = false;

        // Check dependencies
        const pkg = this.getPackageJson();
        const twVersion = pkg.dependencies?.tailwindcss || pkg.devDependencies?.tailwindcss || '0.0.0';
        // Handle "next", "beta" or "4.x" versions
        const isV4 = twVersion.includes('4') || twVersion.includes('next') || twVersion.includes('beta');

        checks.push({
            name: 'Tailwind Version',
            passed: isV4,
            message: isV4 ? `Tailwind version ${twVersion} (Compatible)` : `Tailwind version ${twVersion} (Upgrade to v4 recommended)`
        });

        return { passed: allPassed, checks };
    }

    /**
     * Validate DaisyUI 5
     */
    async validateDaisyUI(): Promise<ValidationResult> {
        const checks = [];

        const pkg = this.getPackageJson();
        const hasDaisy = !!(pkg.dependencies?.daisyui || pkg.devDependencies?.daisyui);

        checks.push({
            name: 'DaisyUI Installed',
            passed: hasDaisy,
            message: hasDaisy ? 'DaisyUI found in package.json' : 'DaisyUI not installed'
        });

        return { passed: hasDaisy, checks };
    }

    private getPackageJson(): any {
        try {
            const path = join(this.projectRoot, 'package.json');
            return JSON.parse(readFileSync(path, 'utf-8'));
        } catch {
            return {};
        }
    }
}

export const validator = new StackValidator();
