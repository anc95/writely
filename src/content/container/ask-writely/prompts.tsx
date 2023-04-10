import { getSetting, useSettings } from '@/common/store/settings'
import {
  IcBaselineAutoFixHigh,
  IcBaselineCheck,
  IcBaselinePodcasts,
  IcBaselineShortText,
  IcOutlineAutoStories,
  IcOutlineLightbulb,
  IcOutlineTranslate,
  IcRoundQuestionMark,
  IcSharpPanoramaWideAngle,
  MaterialSymbolsEnergyProgramTimeUsedSharp,
  MaterialSymbolsFormatListBulletedSharp,
  MaterialSymbolsToolsPliersWireStripperOutlineSharp,
  MdiMessageReplyTextOutline,
  MdiTextLong,
  MdiTreeOutline,
} from '@/components/icon'
import i18n from 'i18next'

export const defaultPrompt = (params: { task: string }) => {
  return (content: string) => {
    return i18n.t('Prompt template', {
      content,
      task: params.task,
    })
  }
}

function getRandomEmoji() {
  const emojis = [
    '😀',
    '😂',
    '😍',
    '🤔',
    '🙄',
    '😇',
    '🤤',
    '🥳',
    '🥺',
    '😎',
    '😜',
    '🤪',
  ]
  const randomIndex = Math.floor(Math.random() * emojis.length)
  return emojis[randomIndex]
}

let settings = null

;(async function () {
  settings = await getSetting()
})()

const getPrompts = () => {
  const customInstructions = settings?.customInstructions || []

  const predefined = [
    {
      category: i18n.t('Edit or review selection'),
      menus: [
        {
          label: i18n.t('Improve writing'),
          icon: <IcBaselineAutoFixHigh />,
        },
        {
          label: i18n.t('Fix spell and grammar'),
          icon: <IcBaselineCheck />,
        },
        {
          label: i18n.t('Make shorter'),
          icon: <IcBaselineShortText />,
        },
        {
          label: i18n.t('Make Longer'),
          icon: <MdiTextLong />,
        },
        {
          label: i18n.t('Change tone'),
          icon: <MdiTreeOutline />,
          children: [
            i18n.t('Professional'),
            i18n.t('Casual'),
            i18n.t('Straightforward'),
            i18n.t('Confident'),
            i18n.t('Friendly'),
          ].map((label) => {
            return {
              label,
              instruction: i18n.t('Change tone to'),
            }
          }),
        },
      ],
    },
    {
      category: i18n.t('Generate from selection'),
      menus: [
        {
          label: i18n.t('Summarize'),
          icon: <IcOutlineAutoStories />,
        },
        {
          label: i18n.t('Translate to'),
          icon: <IcOutlineTranslate />,
          children: [
            {
              label: i18n.t('English'),
              icon: '🇬🇧 ',
            },
            {
              label: i18n.t('Chinese'),
              icon: '🇨🇳 ',
            },
            {
              label: i18n.t('Japanese'),
              icon: '🇯🇵 ',
            },
            {
              label: i18n.t('Korean'),
              icon: '🇰🇷 ',
            },
            {
              label: i18n.t('German'),
              icon: '🇩🇪 ',
            },
            {
              label: i18n.t('French'),
              icon: '🇫🇷 ',
            },
            {
              label: i18n.t('Italian'),
              icon: '🇮🇹 ',
            },
          ].map((item) => {
            return {
              ...item,
              instruction: i18n.t('Translate to') + ' ' + item.label,
            }
          }),
        },
        {
          label: i18n.t('Explain this'),
          icon: <IcRoundQuestionMark />,
        },
        {
          label: i18n.t('Find action items'),
          icon: <MaterialSymbolsFormatListBulletedSharp />,
        },
      ],
    },
    {
      category: i18n.t('Draft with AI'),
      icon: <IcSharpPanoramaWideAngle />,
      menus: [
        {
          label: i18n.t('Brain storm ideas'),
          icon: <IcOutlineLightbulb />,
        },
        {
          label: i18n.t('Blog post'),
          icon: <MdiMessageReplyTextOutline />,
        },
        {
          label: i18n.t('Social media post'),
          icon: <IcBaselinePodcasts />,
        },
        {
          label: i18n.t('Press release'),
          icon: <MaterialSymbolsEnergyProgramTimeUsedSharp />,
        },
        {
          label: i18n.t('Creative story'),
          icon: <MaterialSymbolsToolsPliersWireStripperOutlineSharp />,
        },
        {
          label: i18n.t('Essay'),
          icon: <MaterialSymbolsToolsPliersWireStripperOutlineSharp />,
        },
        {
          label: i18n.t('Poem'),
          icon: <MaterialSymbolsToolsPliersWireStripperOutlineSharp />,
        },
        {
          label: i18n.t('Job description'),
          icon: <MaterialSymbolsToolsPliersWireStripperOutlineSharp />,
        },
        {
          label: i18n.t('Pros and cons list'),
          icon: <MaterialSymbolsToolsPliersWireStripperOutlineSharp />,
        },
      ].map((item) => {
        return {
          ...item,
          instruction: i18n.t('Write a') + ' ' + item.label,
        }
      }),
    },
  ]

  if (customInstructions?.length) {
    predefined.unshift({
      category: i18n.t('Custom instructions'),
      menus: customInstructions?.map((i) => ({
        label: i.name,
        icon: i.icon,
        instruction: i.instruction,
      })),
    })
  }

  return predefined
}

export class PromptCenter {
  protected prompts

  constructor() {
    this.initPrompts()
  }

  private initPrompts = () => {
    this.prompts = this.constructPrompts(getPrompts())
  }

  private constructPrompts = (prompts, prefix: string = '') => {
    return prompts.map((p) => {
      if (!prompts.children?.length) {
        return {
          ...p,
          prompt: defaultPrompt({
            task: p.label,
          }),
        }
      }

      return {
        ...p,
        children: this.constructPrompts(p.children, prefix + ' ' + p.label),
      }
    })
  }

  public useDropDownItems = (keyword = '') => {
    const result = []
    const match = (str: string) => {
      return str.toLowerCase().includes(keyword.toLowerCase())
    }

    this.prompts.forEach((category) => {
      if (match(category.category)) {
        result.push(category)
      } else {
        const matchedMenus = []

        category.menus.forEach((menu) => {
          if (match(menu.label) || match(menu.instruction || '')) {
            matchedMenus.push(menu)
          } else {
            const matchedSubMenus = []

            if (menu.children) {
              menu.children.forEach((c) => {
                if (match(c.label) || match(c.instruction || '')) {
                  matchedSubMenus.push(c)
                }
              })
            }

            if (matchedSubMenus.length) {
              matchedMenus.push(matchedSubMenus)
            }
          }
        })

        if (matchedMenus.length) {
          result.push({
            ...category,
            menus: matchedMenus,
          })
        }
      }
    })

    return result
  }
}
