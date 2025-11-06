import { QuartzConfig } from "quartz/config"
import * as Plugin from "quartz/plugins"
import * as Shared from "./quartz.layout"

/**
 * Quartz 4.0 Configuration
 * 
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Muliminty Note",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "zh-CN",
    baseUrl: process.env.BASE_URL ?? "muliminty.github.io",
    ignorePatterns: [
      "private",
      "xx-归档",
      "xx-草稿",
      ".obsidian",
      "node_modules",
      ".git",
    ],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e0e0",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ 
        enableInHtml: true,
        comments: true,
        highlight: true,
        wikilinks: true,
        callouts: true,
        mermaid: true,
        parseTags: true,
        enableLatex: true,
      }),
      Plugin.GitHubFlavoredMarkdown({
        enableHardLineBreaks: true,
        enableTaskList: true,
        enableSmartyPants: true,
      }),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.Mermaid(),
      Plugin.TableOfContents({
        minEntries: 1,
        maxDepth: 6,
        collapseByDefault: false,
        showByDefault: true,
      }),
    ],
    filters: [
      Plugin.RemoveDrafts(),
    ],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Search({ // 启用全文搜索
        // 搜索配置选项
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
  layout: {
    sharedPageComponents: Shared.sharedPageComponents,
    defaultContentPageLayout: Shared.defaultContentPageLayout,
    defaultListPageLayout: Shared.defaultListPageLayout,
  },
}

export default config

