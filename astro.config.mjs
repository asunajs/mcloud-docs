// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'mcloud-sign',
			logo: {
				src: './src/assets/logo.svg',
				alt: 'mcloud-sign Logo',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/asunajs/mcloud-docs' },
			],
			sidebar: [
				{
					label: '指南',
					items: [
						{ autogenerate: { directory: 'guides' } },
					],
				},
				{
					label: '配置',
					items: [
						{ autogenerate: { directory: 'config' } },
					],
				},
				{
					label: '功能',
					items: [
						{ autogenerate: { directory: 'features' } },
					],
				},
				{
					label: '技术',
					items: [
						{ autogenerate: { directory: 'technical' } },
					],
				},
			],
			locales: {
				root: { label: '简体中文', lang: 'zh-CN' },
			},
		}),
	],
});
