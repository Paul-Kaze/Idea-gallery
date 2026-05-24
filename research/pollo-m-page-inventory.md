# Pollo /m Page Inventory

Source: https://pollo.ai/m  
Accessed: 2026-05-21  
Scope: top-level model and tool cards visible on the Pollo `/m` hub. Pollo also has deeper child URLs such as `/m/pollo-ai`, `/m/seedance/seedance-2-0`, and `/m/kling-ai/kling-3-0`; those should be handled as a second recursive crawl rather than mixed into this first top-level page batch.

## Summary

- Pollo exposes 138 top-level AI video model/tool landing pages from `/m`.
- A recursive pass surfaced additional `/m/**` URLs beyond the visible video hub list: image-model pages, owned-model pages, legacy aliases, and second-layer version/capability pages.
- The current local implementation covers 30+ top-level routes via `apps/web-next/app/m/model-data.ts`, including the added image-model, owned-model, and alias pages.
- The biggest local gap is the remaining top-level brand/model pages, plus a second layer of model-version pages.
- Local note: we now have both the Seedance brand hub `/m/seedance` and specific Seedance version pages such as `/m/seedance-2.0`.

## Existing Local Coverage

Already added locally:

`/m/veo`, `/m/sora`, `/m/kling-ai`, `/m/hailuo-ai`, `/m/pixverse-ai`, `/m/runway-ai`, `/m/luma-ai`, `/m/pika-ai`, `/m/haiper-ai`, `/m/animaker`, `/m/akool`, `/m/heygen`, `/m/vidnoz`, `/m/medeo`, `/m/seedance`, `/m/wan-ai`, `/m/pollo-ai`, `/m/seaweed`, `/m/wanx-ai`, `/m/gpt-image-2`, `/m/nano-banana-2`, `/m/recraft`, `/m/ideogram`, `/m/stable-diffusion`, `/m/flux-ai`, `/m/seedream`, `/m/dall-e`, `/m/imagen`, `/m/gpt-4o`, `/m/flux-kontext`, `/m/qwen-image`, `/m/midjourney`

## Recommended Build Order

P0 should be the highest-search-demand models and the obvious competitor brand terms:

`/m/seedance`, `/m/vidu-ai`, `/m/wan-ai`, `/m/hunyuan`, `/m/krea-ai`, `/m/stable-video-diffusion`, `/m/dreamina`, `/m/adobe-firefly`, `/m/capcut`, `/m/synthesia`, `/m/flow`, `/m/d-id`

P1 should be established video/editor/avatar brands with commercial intent:

`/m/veed-io`, `/m/pictory`, `/m/invideo-ai`, `/m/flexclip`, `/m/fliki-ai`, `/m/deepai`, `/m/videoscribe`, `/m/renderforest`, `/m/powtoon`, `/m/media-io`, `/m/vyond`, `/m/lumen5`, `/m/mango-animate`, `/m/elai`, `/m/kapwing`, `/m/opusclip`, `/m/vizard-ai`, `/m/descript`, `/m/clipchamp`

P2 can be the long-tail expansion batch after the template, sitemap, and schema are stable.

## Full Top-Level List

| # | Pollo path | Page label | Local status |
|---:|---|---|---|
| 1 | `/m/veo` | Veo AI Video Generator | Done |
| 2 | `/m/sora` | Sora AI Video Generator | Done |
| 3 | `/m/kling-ai` | Kling AI Video Generator | Done |
| 4 | `/m/hailuo-ai` | Hailuo AI Video Generator | Done |
| 5 | `/m/pixverse-ai` | PixVerse AI Video Generator | Done |
| 6 | `/m/runway-ai` | Runway AI Video Generator | Done |
| 7 | `/m/vidu-ai` | Vidu AI Video Generator | Todo |
| 8 | `/m/luma-ai` | Luma AI Video Generator | Done |
| 9 | `/m/pika-ai` | Pika AI Video Generator | Done |
| 10 | `/m/seedance` | Seedance AI Video Generator | Done |
| 11 | `/m/wan-ai` | Wan AI Video Generator | Done |
| 12 | `/m/hunyuan` | Hunyuan AI Video Generator | Todo |
| 13 | `/m/krea-ai` | Krea AI Video Generator | Todo |
| 14 | `/m/stable-video-diffusion` | Stable Video Diffusion AI Video Generator | Todo |
| 15 | `/m/video-ocean` | Video Ocean | Todo |
| 16 | `/m/haiper-ai` | Haiper AI Video Generator | Done |
| 17 | `/m/happy-horse` | Happy Horse AI Video Generator | Todo |
| 18 | `/m/bytedance-dreamactor` | Bytedance Dreamactor | Todo |
| 19 | `/m/bytedance-imitator` | Bytedance Imitator | Todo |
| 20 | `/m/grok-imagine` | Grok Imagine AI Video Model | Todo |
| 21 | `/m/artlist` | Artlist AI Video Generator | Todo |
| 22 | `/m/dreamina` | Dreamina AI Video Generator | Todo |
| 23 | `/m/veed-io` | VEED AI Video Generator | Todo |
| 24 | `/m/pictory` | Pictory AI Video Generator | Todo |
| 25 | `/m/adobe-firefly` | Adobe Firefly AI Video Generator | Todo |
| 26 | `/m/invideo-ai` | Invideo AI Video Generator | Todo |
| 27 | `/m/animaker` | Animaker AI Video Generator | Done |
| 28 | `/m/medeo` | Medeo AI Video Generator | Done |
| 29 | `/m/picwand` | Picwand AI Video Generator | Todo |
| 30 | `/m/flova-ai` | Flova AI Video Generator | Todo |
| 31 | `/m/arcads` | Arcads AI Video Generator | Todo |
| 32 | `/m/vidfly-ai` | VidFly AI Video Generator | Todo |
| 33 | `/m/goenhance-ai` | GoEnhance AI Video Generator | Todo |
| 34 | `/m/akool` | Akool AI Video Generator | Done |
| 35 | `/m/animoto` | Animoto AI Video Generator | Todo |
| 36 | `/m/flexclip` | FlexClip AI Video Generator | Todo |
| 37 | `/m/capcut` | CapCut AI Video Editor | Todo |
| 38 | `/m/fliki-ai` | Fliki AI Video Generator | Todo |
| 39 | `/m/heygen` | HeyGen AI Video Generator | Done |
| 40 | `/m/deepai` | DeepAI AI Video Generator | Todo |
| 41 | `/m/steve-ai` | Steve AI Video Generator | Todo |
| 42 | `/m/videoscribe` | VideoScribe AI Video Generator | Todo |
| 43 | `/m/higgsfield-ai` | Higgsfield AI Video Generator | Todo |
| 44 | `/m/renderforest` | Renderforest AI Video Generator | Todo |
| 45 | `/m/powtoon` | Powtoon AI Video Generator | Todo |
| 46 | `/m/media-io` | Media.io AI Video Generator | Todo |
| 47 | `/m/vyond` | Vyond AI Video Generator | Todo |
| 48 | `/m/lumen5` | Lumen5 AI Video Generator | Todo |
| 49 | `/m/oiioii-ai` | OiiOii AI Video Generator | Todo |
| 50 | `/m/placeit` | Placeit AI Video Generator | Todo |
| 51 | `/m/litvideo` | LitVideo AI Video Generator | Todo |
| 52 | `/m/vidnoz` | Vidnoz AI Video Generator | Done |
| 53 | `/m/elai` | Elai AI Video Generator | Todo |
| 54 | `/m/mango-animate` | Mango AI Video Generator | Todo |
| 55 | `/m/synthesia` | Synthesia AI Video Generator | Todo |
| 56 | `/m/funy-ai` | Funy AI Video Generator | Todo |
| 57 | `/m/deevid-ai` | DeeVid AI Video Generator | Todo |
| 58 | `/m/mindvideo` | MindVideo AI Video Generator | Todo |
| 59 | `/m/videoweb-ai` | VideoWeb AI Video Generator | Todo |
| 60 | `/m/magicshot` | MagicShot AI Video Generator | Todo |
| 61 | `/m/insmind` | insMind AI Video Generator | Todo |
| 62 | `/m/kapwing` | Kapwing AI Video Editor | Todo |
| 63 | `/m/wixel` | Wixel AI Video Generator | Todo |
| 64 | `/m/domoai` | DomoAI Video Generator | Todo |
| 65 | `/m/opusclip` | OpusClip AI Video Editor | Todo |
| 66 | `/m/biteable` | Biteable AI Video Generator | Todo |
| 67 | `/m/videogen` | VideoGen AI Video Generator | Todo |
| 68 | `/m/vizard-ai` | Vizard AI Video Editor | Todo |
| 69 | `/m/flow` | Google Flow AI Video Generator | Todo |
| 70 | `/m/promo` | Promo Video Generator | Todo |
| 71 | `/m/easemate` | EaseMate AI Video Generator | Todo |
| 72 | `/m/magiclight-ai` | MagicLight AI Video Generator | Todo |
| 73 | `/m/deepswap` | DeepSwap AI Video Generator | Todo |
| 74 | `/m/flashloop` | Flashloop AI Video Generator | Todo |
| 75 | `/m/visla` | Visla AI Video Generator | Todo |
| 76 | `/m/frameo-ai` | Frameo AI Video Generator | Todo |
| 77 | `/m/dzine-ai` | Dzine AI Video Generator | Todo |
| 78 | `/m/yapper` | Yapper AI Video Generator | Todo |
| 79 | `/m/edimakor` | Edimakor AI Video Editor | Todo |
| 80 | `/m/postsyncer` | PostSyncer AI Video Generator | Todo |
| 81 | `/m/freebeat-ai` | Freebeat AI Music Video Generator | Todo |
| 82 | `/m/quickframe` | QuickFrame AI Video Generator | Todo |
| 83 | `/m/sendshort` | SendShort AI Video Editor | Todo |
| 84 | `/m/a2e-ai` | A2E AI Video Generator | Todo |
| 85 | `/m/clideo` | Clideo AI Video Editor | Todo |
| 86 | `/m/joyfun-ai` | JoyFun AI Video Generator | Todo |
| 87 | `/m/unlucid-ai` | Unlucid AI Video Generator | Todo |
| 88 | `/m/skyreels` | SkyReels AI Video Generator | Todo |
| 89 | `/m/wayinvideo` | WayinVideo AI Video Editor | Todo |
| 90 | `/m/vidful` | Vidful AI Video Generator | Todo |
| 91 | `/m/inshot` | InShot AI Video Editor | Todo |
| 92 | `/m/neonlights-ai` | NeonLights AI Video Generator | Todo |
| 93 | `/m/ltx-studio` | LTX Studio AI Video Generator | Todo |
| 94 | `/m/parrot-ai` | Parrot AI Video Generator | Todo |
| 95 | `/m/magic-hour` | Magic Hour AI Video Generator | Todo |
| 96 | `/m/vidmage` | VidMage AI Video Generator | Todo |
| 97 | `/m/hypernatural-ai` | Hypernatural AI Video Generator | Todo |
| 98 | `/m/digen-ai` | Digen AI Video Generator | Todo |
| 99 | `/m/faceless-video` | Faceless.video AI Video Generator | Todo |
| 100 | `/m/miricanvas` | MiriCanvas AI Video Generator | Todo |
| 101 | `/m/reelmind` | Reelmind AI Video Generator | Todo |
| 102 | `/m/amuse` | Amuse AI Video Generator | Todo |
| 103 | `/m/aura-ai` | Aura AI Video Generator | Todo |
| 104 | `/m/neural-frames` | Neural Frames AI Video Generator | Todo |
| 105 | `/m/hedra` | Hedra AI Video Generator | Todo |
| 106 | `/m/zeely` | Zeely AI Video Generator | Todo |
| 107 | `/m/creatify` | Creatify AI Video Generator | Todo |
| 108 | `/m/descript` | Descript AI Video Editor | Todo |
| 109 | `/m/dreamface` | Dreamface AI Video Generator | Todo |
| 110 | `/m/basedlabs` | BasedLabs AI Video Generator | Todo |
| 111 | `/m/venice-ai` | Venice AI Video Generator | Todo |
| 112 | `/m/visualgpt` | VisualGPT AI Video Generator | Todo |
| 113 | `/m/riverside` | Riverside AI Video Editor | Todo |
| 114 | `/m/golpo` | Golpo AI Video Generator | Todo |
| 115 | `/m/clipchamp` | Clipchamp AI Video Editor | Todo |
| 116 | `/m/weshop-ai` | WeShop AI Video Generator | Todo |
| 117 | `/m/makeugc` | MakeUGC AI Video Generator | Todo |
| 118 | `/m/topview-ai` | Topview AI Video Editor | Todo |
| 119 | `/m/revid-ai` | Revid AI Video Generator | Todo |
| 120 | `/m/pippit-ai` | Pippit AI Video Generator | Todo |
| 121 | `/m/colossyan` | Colossyan AI Video Generator | Todo |
| 122 | `/m/vadoo-ai` | Vadoo AI Video Generator | Todo |
| 123 | `/m/gigapixel-ai` | Gigapixel AI Video Generator | Todo |
| 124 | `/m/pixelbin` | PixelBin AI Video Generator | Todo |
| 125 | `/m/jogg-ai` | Jogg AI Video Generator | Todo |
| 126 | `/m/imagiyo-ai` | Imagiyo AI Video Generator | Todo |
| 127 | `/m/adcreative-ai` | AdCreative AI Video Generator | Todo |
| 128 | `/m/d-id` | D-ID AI Avatar Video Generator | Todo |
| 129 | `/m/ovi-ai` | Ovi AI Video Generator | Todo |
| 130 | `/m/wavespeed-ai` | WaveSpeed AI Video Generator | Todo |
| 131 | `/m/flat-ai` | Flat AI Video Generator | Todo |
| 132 | `/m/vheer` | Vheer AI Video Generator | Todo |
| 133 | `/m/vmaker-ai` | Vmaker AI Video Generator | Todo |
| 134 | `/m/tensorpix` | TensorPix AI Video Enhancer | Todo |
| 135 | `/m/weavy-ai` | Weavy AI Video Editor | Todo |
| 136 | `/m/tensor-art` | Tensor Art AI Video Generator | Todo |
| 137 | `/m/socialsight-ai` | SocialSight AI Video Generator | Todo |
| 138 | `/m/sjinn-ai` | SJinn AI Video Generator | Todo |

## Recursive Crawl Addendum

Method: Pollo's XML sitemap was blocked by Cloudflare in direct CLI access, so this pass combines the visible `/m` hub links, opened Pollo pages, and indexed search results for `site:pollo.ai/m/...`. Treat `Confirmed` rows as build-ready URL candidates. Treat `Inferred` rows as page templates/model names found in Pollo page copy where the exact English slug still needs one final URL check before shipping.

### Additional Top-Level `/m` Pages

These pages are outside the 138 video hub-card list but are still part of Pollo's `/m` subtree.

| Pollo path | Page type | Local status | Confidence |
|---|---|---|---|
| `/m/pollo-ai` | Pollo owned model page | Done | Confirmed |
| `/m/seaweed` | Seedance legacy/alias page | Done | Confirmed from index |
| `/m/wanx-ai` | Wan legacy/alias page | Done | Confirmed from index |
| `/m/gpt-image-2` | image model page | Done | Confirmed |
| `/m/nano-banana-2` | image model page | Done | Confirmed |
| `/m/recraft` | image model page | Done | Confirmed from hub nav |
| `/m/ideogram` | image model page | Done | Confirmed from hub nav |
| `/m/stable-diffusion` | image model page | Done | Confirmed from hub nav |
| `/m/flux-ai` | image model page | Done | Confirmed from hub nav |
| `/m/seedream` | image model hub page | Done; local also has `/m/seedream-4.0` and `/m/seedream-4.5` | Confirmed from hub nav |
| `/m/dall-e` | image model page | Done | Confirmed from hub nav |
| `/m/imagen` | image model page | Done | Confirmed from hub nav |
| `/m/gpt-4o` | image model page | Done | Confirmed from hub nav |
| `/m/flux-kontext` | image model page | Done | Confirmed from hub nav |
| `/m/qwen-image` | image model page | Done | Confirmed from hub nav |
| `/m/midjourney` | image model page | Done | Confirmed from localized index |

### Confirmed Child URLs

| Parent | Pollo path | Page type | Local status |
|---|---|---|---|
| Pollo AI | `/m/pollo-ai` | owned model page | Todo |
| Seedance | `/m/seedance/seedance-2-0` | model version page | Local equivalent exists at `/m/seedance-2.0`; no nested route |
| Veo | `/m/veo/veo-2` | model version page | Todo |
| Veo | `/m/veo/veo-3` | model version page | Todo |
| Veo | `/m/veo/veo-3-fast` | model version page | Todo |
| Veo | `/m/veo/veo-3-1` | model version page | Todo |
| Sora | `/m/sora/sora-2` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-1-0` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-1-5` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-1-6` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-2-0` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-2-1` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-2-5-turbo` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-2-6` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-3-0` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-3-0-motion-control` | capability/version page | Todo |
| Kling AI | `/m/kling-ai/kling-o1` | model version page | Todo |
| Kling AI | `/m/kling-ai/kling-ai-elements` | capability page | Todo |
| Hailuo AI | `/m/hailuo-ai/hailuo-ai-i2v-01-live` | model version page | Todo |
| Hailuo AI | `/m/hailuo-ai/hailuo-ai-i2v-01` | model version page | Todo |
| Hailuo AI | `/m/hailuo-ai/hailuo-ai-t2v-01` | model version page | Todo |
| Hailuo AI | `/m/hailuo-ai/hailuo-t2v-01-director` | model version page | Todo |
| Hailuo AI | `/m/hailuo-ai/hailuo-02` | model version page | Todo |
| Hailuo AI | `/m/hailuo-ai/hailuo-2-3` | model version page | Todo |
| Runway AI | `/m/runway-ai/text-to-video` | capability page | Todo |
| Runway AI | `/m/runway-ai/act-one` | capability page | Todo |
| Hunyuan | `/m/hunyuan/image-to-video` | capability page | Todo |
| Wan AI | `/m/wan-ai/wan-2-6` | model version page | Todo |

### Child URLs To Verify Before Build

These were surfaced by Pollo page copy or localized/indexed snippets, but the exact English path should be checked once more before adding them to production routes.

| Parent | Candidate path | Page type | Confidence |
|---|---|---|---|
| PixVerse AI | `/m/pixverse-ai/pixverse-v5-5` | model version page | Inferred from localized indexed page |
| PixVerse AI | `/m/pixverse-ai/pixverse-v5` | model version page | Inferred from model list |
| PixVerse AI | `/m/pixverse-ai/pixverse-v4-5` | model version page | Inferred from model list |
| PixVerse AI | `/m/pixverse-ai/pixverse-v3-5` | model version page | Inferred from model list |
| PixVerse AI | `/m/pixverse-ai/pixverse-v3` | model version page | Inferred from model list |
| PixVerse AI | `/m/pixverse-ai/pixverse-v2-5` | model version page | Inferred from model list |
| PixVerse AI | `/m/pixverse-ai/pixverse-v2` | model version page | Inferred from model list |
| PixVerse AI | `/m/pixverse-ai/pixverse-ai-venom` | model/capability page | Inferred from model list |
| Runway AI | `/m/runway-ai/image-to-video` | capability page | Inferred from product pattern |
| Runway AI | `/m/runway-ai/gen-4` | model version page | Inferred from model family |
| Runway AI | `/m/runway-ai/gen-3-alpha-turbo` | model version page | Inferred from model family |
| Runway AI | `/m/runway-ai/gen-3-alpha` | model version page | Inferred from model family |
| Runway AI | `/m/runway-ai/gen-2` | model version page | Inferred from model family |
| Vidu AI | `/m/vidu-ai/vidu-1-0` | model version page | Confirmed from indexed page |
| Vidu AI | `/m/vidu-ai/vidu-1-5` | model version page | Inferred from model list |
| Vidu AI | `/m/vidu-ai/vidu-2-0` | model version page | Inferred from model list |
| Vidu AI | `/m/vidu-ai/vidu-q1` | model version page | Inferred from model list |
| Vidu AI | `/m/vidu-ai/vidu-q2` | model version page | Inferred from model list |
| Vidu AI | `/m/vidu-ai/vidu-q3` | model version page | Inferred from model list |
| Wan AI | `/m/wan-ai/wan-2-2` | model version page | Inferred from model list |
| Wan AI | `/m/wan-ai/wan-2-2-animate` | model version page | Inferred from model list |
| Wan AI | `/m/wan-ai/wan-2-5` | model version page | Inferred from model list |

### Build Notes

- For our project, do not mirror every nested Pollo path blindly. Use the Pollo crawl as keyword and architecture evidence, then map each page to Dommi's actual model/tool value.
- Highest-value recursive pages to create first: `/m/seedance`, `/m/pollo-ai`, `/m/veo/veo-3`, `/m/veo/veo-3-1`, `/m/sora/sora-2`, `/m/kling-ai/kling-3-0`, `/m/hailuo-ai/hailuo-02`, `/m/wan-ai/wan-2-6`, `/m/hunyuan/image-to-video`.
- URL strategy choice needed before implementation: either mirror Pollo-style nested paths (`/m/kling-ai/kling-3-0`) or keep our flatter existing pattern (`/m/seedance-2.0`). For SEO conquest pages, nested paths make the hub/spoke relationship clearer, but flat routes are easier to fit into the current `app/m/[slug]` implementation.
