import { defineComponent } from '@mdocui/core'
import { z } from 'zod'

export const allDefinitions = [
	defineComponent({
		name: 'stack',
		description: 'Vertical or horizontal flex container',
		props: z.object({
			direction: z.enum(['vertical', 'horizontal']).optional().describe('Stack direction'),
			gap: z.enum(['none', 'sm', 'md', 'lg']).optional().describe('Spacing between children'),
		}),
		children: 'any',
	}),
	defineComponent({
		name: 'grid',
		description: 'CSS grid layout with configurable columns',
		props: z.object({
			cols: z.number().optional().describe('Number of columns'),
		}),
		children: 'any',
	}),
	defineComponent({
		name: 'card',
		description: 'Bordered content container with optional title',
		props: z.object({
			title: z.string().optional().describe('Card heading'),
		}),
		children: 'any',
	}),
	defineComponent({
		name: 'divider',
		description: 'Horizontal separator line',
		props: z.object({}),
		children: 'none',
	}),
	defineComponent({
		name: 'accordion',
		description: 'Collapsible content section',
		props: z.object({
			title: z.string().describe('Accordion header text'),
			open: z.boolean().optional().describe('Whether expanded by default'),
		}),
		children: 'any',
	}),
	defineComponent({
		name: 'tabs',
		description: 'Tabbed content container',
		props: z.object({
			labels: z.array(z.string()).describe('Tab labels in order'),
			active: z.number().optional().describe('Zero-based index of active tab'),
		}),
		children: 'any',
	}),
	defineComponent({
		name: 'tab',
		description: 'Single tab panel',
		props: z.object({ label: z.string().describe('Tab label') }),
		children: 'any',
	}),
	defineComponent({
		name: 'button',
		description: 'Clickable action button',
		props: z.object({
			action: z.string().describe('Action identifier — "continue" sends label as new message'),
			label: z.string().describe('Button text'),
			variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).optional().describe('Visual style'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'button-group',
		description: 'Row of related buttons',
		props: z.object({}),
		children: ['button'],
	}),
	defineComponent({
		name: 'input',
		description: 'Text input field',
		props: z.object({
			name: z.string().describe('Field name'),
			label: z.string().optional().describe('Input label'),
			placeholder: z.string().optional().describe('Placeholder text'),
			type: z.enum(['text', 'email', 'password', 'number']).optional().describe('Input type'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'select',
		description: 'Dropdown select menu',
		props: z.object({
			name: z.string().describe('Field name'),
			label: z.string().optional().describe('Select label'),
			options: z.array(z.string()).describe('Option values'),
			placeholder: z.string().optional().describe('Placeholder'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'textarea',
		description: 'Multi-line text input',
		props: z.object({
			name: z.string().describe('Field name'),
			label: z.string().optional().describe('Textarea label'),
			placeholder: z.string().optional().describe('Placeholder text'),
			rows: z.number().optional().describe('Number of visible rows'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'checkbox',
		description: 'Toggle checkbox',
		props: z.object({
			name: z.string().describe('Field name'),
			label: z.string().describe('Checkbox label'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'toggle',
		description: 'On/off toggle switch',
		props: z.object({
			name: z.string().describe('Field name'),
			label: z.string().describe('Toggle label'),
			checked: z.boolean().optional().describe('Default state'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'form',
		description: 'Form container that groups inputs and submits their state',
		props: z.object({
			name: z.string().describe('Form identifier'),
		}),
		children: ['input', 'textarea', 'select', 'checkbox', 'toggle', 'button'],
	}),
	defineComponent({
		name: 'chart',
		description: 'Data visualization',
		props: z.object({
			type: z.enum(['bar', 'line', 'pie', 'donut']).describe('Chart type'),
			labels: z.array(z.string()).describe('Category labels'),
			values: z.array(z.number()).describe('Data values'),
			title: z.string().optional().describe('Chart title'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'table',
		description: 'Data table with headers and rows',
		props: z.object({
			headers: z.array(z.string()).describe('Column headers'),
			rows: z.array(z.array(z.string())).describe('Row data'),
			caption: z.string().optional().describe('Table caption'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'stat',
		description: 'Key metric display',
		props: z.object({
			label: z.string().describe('Metric name'),
			value: z.string().describe('Metric value'),
			change: z.string().optional().describe('Change indicator like "+12%"'),
			trend: z.enum(['up', 'down', 'neutral']).optional().describe('Trend direction'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'progress',
		description: 'Progress bar',
		props: z.object({
			value: z.number().describe('Current value (0-100)'),
			label: z.string().optional().describe('Progress label'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'callout',
		description: 'Highlighted message block',
		props: z.object({
			type: z.enum(['info', 'warning', 'error', 'success']).describe('Callout severity'),
			title: z.string().optional().describe('Callout heading'),
		}),
		children: 'any',
	}),
	defineComponent({
		name: 'badge',
		description: 'Inline label or tag',
		props: z.object({
			label: z.string().describe('Badge text'),
			variant: z.enum(['default', 'success', 'warning', 'error', 'info']).optional().describe('Color variant'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'image',
		description: 'Inline image',
		props: z.object({
			src: z.string().describe('Image URL'),
			alt: z.string().describe('Alt text'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'code-block',
		description: 'Code block',
		props: z.object({
			language: z.string().optional().describe('Programming language'),
			title: z.string().optional().describe('Filename or title'),
			code: z.string().describe('Source code'),
		}),
		children: 'none',
	}),
	defineComponent({
		name: 'link',
		description: 'Clickable link',
		props: z.object({
			action: z.string().describe('Action identifier'),
			label: z.string().describe('Link text'),
			url: z.string().optional().describe('Target URL'),
		}),
		children: 'none',
	}),
]

export const defaultGroups = [
	{
		name: 'Layout',
		components: ['stack', 'grid', 'card', 'divider', 'accordion', 'tabs', 'tab'],
	},
	{
		name: 'Interactive',
		components: ['button', 'button-group', 'input', 'textarea', 'select', 'checkbox', 'toggle', 'form'],
		notes: ['button action="continue" sends label as message', 'Wrap inputs in a form for state collection'],
	},
	{
		name: 'Data',
		components: ['chart', 'table', 'stat', 'progress'],
	},
	{
		name: 'Content',
		components: ['callout', 'badge', 'image', 'code-block', 'link'],
	},
]
