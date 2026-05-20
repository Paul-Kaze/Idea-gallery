import type { Metadata } from 'next'

export type CoupleIdea = {
  title: string
  tag: string
  image: string
  bestFor: string
  prompt: string
  mistake: string
}

export type CoupleSection = {
  title: string
  text: string
  items: string[]
}

export type CoupleFaq = {
  q: string
  a: string
}

export type CoupleLandingData = {
  slug: string
  metadata: Metadata
  eyebrow: string
  h1: string
  intro: string
  primaryCta: string
  secondaryCta: string
  heroImage: string
  heroAlt: string
  stats: string[]
  filters: string[]
  ideasIntro: string
  ideas: CoupleIdea[]
  guideTitle: string
  guideIntro: string
  guideSections: CoupleSection[]
  generatorTitle: string
  generatorIntro: string
  generatorChips: string[]
  privacyNote: string
  faqTitle: string
  faqs: CoupleFaq[]
  related: Array<{ label: string; href: string }>
}

const image = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`

export const coupleLandingPages: Record<string, CoupleLandingData> = {
  'couple-photoshoot-ideas': {
    slug: 'couple-photoshoot-ideas',
    metadata: {
      title: 'Couple Photoshoot Ideas You Can Recreate With AI | Dommi',
      description:
        'Browse romantic, casual, indoor, outdoor, and long-distance couple photoshoot ideas. Choose a look and recreate it with AI couple photos.',
      alternates: { canonical: '/ideas/couple-photoshoot-ideas' },
      openGraph: {
        title: 'Couple Photoshoot Ideas You Can Recreate With AI | Dommi',
        description:
          'A visual idea library for natural, romantic couple photos you can recreate from two portraits.',
        url: '/ideas/couple-photoshoot-ideas',
        type: 'article',
      },
    },
    eyebrow: 'Couple Photo Lookbook',
    h1: 'Couple Photoshoot Ideas You Can Recreate With AI',
    intro:
      'Find romantic, casual, cinematic, and long-distance couple photo ideas, then turn two portraits into the same look with Dommi.',
    primaryCta: 'Generate Couple Photos',
    secondaryCta: 'Browse Ideas',
    heroImage: image('4545805'),
    heroAlt: 'Romantic couple photoshoot at sunset',
    stats: ['10 ready-to-generate concepts', 'Two separate photos supported', 'Social-ready crops'],
    filters: ['Romantic', 'Casual', 'Indoor', 'Outdoor', 'Travel', 'Wedding', 'Long Distance', 'Cute'],
    ideasIntro:
      'Start with a mood rather than a blank prompt. Each idea below includes a practical scene, what it works best for, and a prompt you can reuse.',
    ideas: [
      {
        title: 'Golden hour walk',
        tag: 'Outdoor',
        image: image('4545805'),
        bestFor: 'Natural, warm photos that feel candid instead of staged.',
        prompt: 'A couple walking hand in hand through golden hour light, soft wind, natural smiles, cinematic warm tones.',
        mistake: 'Avoid both people standing square to the camera with locked shoulders.',
      },
      {
        title: 'Cozy home portrait',
        tag: 'Indoor',
        image: image('7555813'),
        bestFor: 'Anniversary posts, private keepsakes, and relaxed couples.',
        prompt: 'A cozy at-home couple portrait on a sofa, soft window light, warm blankets, intimate candid mood.',
        mistake: 'Do not make the room too busy; keep the focus on faces and body language.',
      },
      {
        title: 'Cafe date moment',
        tag: 'Casual',
        image: image('28833971'),
        bestFor: 'Everyday romance, social posts, and profile photos.',
        prompt: 'A couple sitting close in a small cafe, coffee cups on the table, soft film photography, relaxed smiles.',
        mistake: 'Avoid stiff eye contact with the camera; let the scene feel like a date.',
      },
      {
        title: 'Rainy street umbrella',
        tag: 'Cinematic',
        image: image('29359026'),
        bestFor: 'A moody editorial look with more drama.',
        prompt: 'A cinematic rainy street couple photo under one umbrella, wet pavement reflections, soft city lights.',
        mistake: 'Keep the pose simple so the weather and lights do the visual work.',
      },
      {
        title: 'Beach sunset silhouette',
        tag: 'Travel',
        image: image('3030595'),
        bestFor: 'Vacation memories and destination-style couple photos.',
        prompt: 'A romantic couple portrait at the beach during sunset, soft waves, warm horizon light, gentle embrace.',
        mistake: 'Avoid making the subjects too small unless the scene is meant to be scenic.',
      },
      {
        title: 'Korean studio portrait',
        tag: 'Studio',
        image: image('10256506'),
        bestFor: 'Clean, polished couple portraits with minimal styling.',
        prompt: 'A Korean studio couple portrait, clean backdrop, coordinated neutral outfits, soft flattering light.',
        mistake: 'Do not over-accessorize; this style works because it is restrained.',
      },
      {
        title: 'Photobooth strip',
        tag: 'Playful',
        image: image('10593750'),
        bestFor: 'Cute, shareable images and lock screens.',
        prompt: 'A playful photobooth-style couple strip with four candid frames, laughing, cheek kiss, silly expression.',
        mistake: 'Keep expressions varied; identical frames feel artificial.',
      },
      {
        title: 'Long-distance reunion',
        tag: 'Long Distance',
        image: image('13122221'),
        bestFor: 'Couples who only have separate selfies or old photos.',
        prompt: 'A long-distance couple reunion at a train station, emotional hug, soft cinematic light, realistic faces.',
        mistake: 'Avoid overly dramatic tears; sincere and subtle usually feels more believable.',
      },
    ],
    guideTitle: 'Choose an idea that fits your actual relationship',
    guideIntro:
      'The best couple photos do not start with perfect poses. They start with a scene that feels believable for the two people in it.',
    guideSections: [
      {
        title: 'For shy couples',
        text: 'Use movement, sitting poses, and looking-at-each-other prompts so neither person has to perform for the camera.',
        items: ['Walking hand in hand', 'Shoulder lean', 'Cafe table conversation'],
      },
      {
        title: 'For social posts',
        text: 'Choose clear silhouettes, expressive faces, and simple backgrounds that still read well on a phone screen.',
        items: ['Photobooth strip', 'Golden hour walk', 'Matching outfit portrait'],
      },
      {
        title: 'For separate photos',
        text: 'Use scenes where the AI can naturally place both people into one shared environment.',
        items: ['Train station reunion', 'Studio portrait', 'Beach sunset'],
      },
    ],
    generatorTitle: 'Turn the idea into your own couple photo',
    generatorIntro:
      'Upload two portraits, pick a mood, and use one of these idea prompts as the starting point for a realistic couple photo.',
    generatorChips: ['Two portraits', 'Romantic styles', 'HD download', 'Private generation'],
    privacyNote: 'Only upload photos you have permission to use. Couple images should be private by default and easy to delete.',
    faqTitle: 'Couple photoshoot ideas FAQ',
    faqs: [
      {
        q: 'What are easy couple photoshoot ideas?',
        a: 'Walking hand in hand, sitting close together, cafe dates, cozy home portraits, and golden hour photos are easy because they rely on natural movement instead of complicated posing.',
      },
      {
        q: 'Can I generate couple photos from two separate pictures?',
        a: 'Yes. The strongest AI couple photo workflow starts from two clear individual portraits and places both people into one shared scene.',
      },
      {
        q: 'What should couples wear for a photoshoot?',
        a: 'Choose coordinated colors rather than identical outfits. Neutrals, soft textures, simple formalwear, and seasonal accents usually work better than loud patterns.',
      },
      {
        q: 'How do I make couple photos look less awkward?',
        a: 'Add movement, turn bodies slightly toward each other, keep hands occupied, and use prompts where the couple interacts instead of staring directly at the camera.',
      },
    ],
    related: [
      { label: 'Couple photoshoot poses', href: '/ideas/couple-photoshoot-poses' },
      { label: 'Engagement photoshoot ideas', href: '/ideas/engagement-photoshoot-ideas' },
      { label: 'Anniversary photo ideas', href: '/ideas/anniversary-photo-ideas' },
    ],
  },
  'engagement-photoshoot-ideas': {
    slug: 'engagement-photoshoot-ideas',
    metadata: {
      title: 'Engagement Photoshoot Ideas for Natural Couple Photos | Dommi',
      description:
        'Plan engagement photos with romantic location, outfit, ring, and pose ideas. Preview engagement-style couple photos with AI.',
      alternates: { canonical: '/ideas/engagement-photoshoot-ideas' },
      openGraph: {
        title: 'Engagement Photoshoot Ideas for Natural Couple Photos | Dommi',
        description: 'Engagement photo ideas for couples who want romantic photos that do not feel generic.',
        url: '/ideas/engagement-photoshoot-ideas',
        type: 'article',
      },
    },
    eyebrow: 'Engagement Photo Planner',
    h1: 'Engagement Photoshoot Ideas for Romantic, Natural Couple Photos',
    intro:
      'Explore engagement photo concepts by location, outfit, pose, and mood, then preview the style before you book a shoot.',
    primaryCta: 'Create Engagement Photos',
    secondaryCta: 'View Concepts',
    heroImage: image('14424027'),
    heroAlt: 'Engagement couple portrait with ring detail',
    stats: ['Ring-focused ideas', 'Indoor and outdoor scenes', 'Photographer-preview friendly'],
    filters: ['City', 'Outdoor', 'Studio', 'Beach', 'Home', 'Ring Detail', 'Formal', 'Candid'],
    ideasIntro:
      'Engagement photos work best when the scene says something about the couple. Use these concepts as a shoot plan or as AI preview prompts.',
    ideas: [
      {
        title: 'Ring close-up',
        tag: 'Detail',
        image: image('14424027'),
        bestFor: 'Announcements, save-the-date graphics, and proposal memories.',
        prompt: 'An engagement ring close-up with both partners holding hands, soft light, elegant shallow depth of field.',
        mistake: 'Do not let the ring cover the faces in every image; mix detail shots with portraits.',
      },
      {
        title: 'City editorial walk',
        tag: 'City',
        image: image('34193846'),
        bestFor: 'Couples who want modern engagement photos without a formal studio feel.',
        prompt: 'A stylish engagement couple walking through a downtown street, editorial framing, coordinated outfits.',
        mistake: 'Avoid visual clutter behind the couple; clean lines make the photo feel premium.',
      },
      {
        title: 'Rooftop proposal mood',
        tag: 'Formal',
        image: image('14096179'),
        bestFor: 'Dramatic announcements and wedding website hero images.',
        prompt: 'A rooftop engagement portrait at dusk, city lights behind the couple, elegant outfits, cinematic mood.',
        mistake: 'Do not make the sky too dark; faces should still be readable.',
      },
      {
        title: 'Golden field embrace',
        tag: 'Outdoor',
        image: image('36986702'),
        bestFor: 'Soft, romantic engagement images that feel timeless.',
        prompt: 'A couple embracing in a golden field, warm sunset light, delicate engagement portrait, natural smiles.',
        mistake: 'Avoid overly saturated grass or sky; keep it gentle and film-like.',
      },
      {
        title: 'Museum date portrait',
        tag: 'Indoor',
        image: image('19109107'),
        bestFor: 'Couples who want a refined, cultured date-night look.',
        prompt: 'An engagement couple inside a quiet art gallery, minimal architecture, elegant black outfits, soft natural light.',
        mistake: 'Keep the art and architecture secondary so the couple remains the subject.',
      },
      {
        title: 'Cozy kitchen engagement',
        tag: 'Home',
        image: image('19628411'),
        bestFor: 'Couples who prefer intimate, real-life images over formal poses.',
        prompt: 'A cozy kitchen engagement photo, couple baking together, ring visible, warm morning light, candid laughter.',
        mistake: 'Do not over-style the kitchen; a lived-in space feels more personal.',
      },
      {
        title: 'Beach announcement',
        tag: 'Beach',
        image: image('3030595'),
        bestFor: 'Destination proposals and relaxed engagement announcements.',
        prompt: 'An engagement couple on a quiet beach, soft waves, ring hand visible, airy white and blue color palette.',
        mistake: 'Avoid harsh midday light; beach scenes work best with low, soft light.',
      },
      {
        title: 'Luxury wedding preview',
        tag: 'Editorial',
        image: image('10593750'),
        bestFor: 'Testing wedding-style looks before choosing a photographer or venue.',
        prompt: 'A luxury engagement editorial portrait, tailored black suit, white dress, editorial lighting, polished wedding preview.',
        mistake: 'Do not make it look like a full wedding if the goal is engagement; keep it anticipatory.',
      },
    ],
    guideTitle: 'Plan the photo before the shoot',
    guideIntro:
      'Engagement photos carry extra pressure because they often become announcements, wedding-site images, or printed keepsakes.',
    guideSections: [
      {
        title: 'Choose one anchor detail',
        text: 'A ring, location, outfit, or shared hobby gives the session a reason to exist.',
        items: ['Ring hand detail', 'First-date location', 'Proposal setting'],
      },
      {
        title: 'Preview the style first',
        text: 'AI previews help couples compare formal, candid, editorial, and destination looks before paying for a session.',
        items: ['Studio editorial', 'City candid', 'Golden field'],
      },
      {
        title: 'Keep outfits coordinated',
        text: 'Engagement outfits should feel like the same story without looking like uniforms.',
        items: ['Black and ivory', 'Soft neutrals', 'One accent color'],
      },
    ],
    generatorTitle: 'Preview engagement photos from two portraits',
    generatorIntro:
      'Use Dommi to test engagement moods, locations, outfits, and poses before committing to a real shoot.',
    generatorChips: ['Ring detail', 'Formal outfits', 'Location presets', 'Photographer preview'],
    privacyNote: 'Engagement images are personal. Keep previews private and only upload photos from both partners with permission.',
    faqTitle: 'Engagement photoshoot ideas FAQ',
    faqs: [
      {
        q: 'What are the best engagement photo ideas?',
        a: 'The strongest ideas are personal but simple: ring close-ups, first-date locations, city walks, home sessions, golden hour fields, beach portraits, and elegant studio photos.',
      },
      {
        q: 'What should we wear for engagement photos?',
        a: 'Wear outfits that share a color story. Formal black and white, soft neutrals, linen, muted pastels, and one shared accent color are reliable choices.',
      },
      {
        q: 'Can AI help plan engagement photos?',
        a: 'Yes. AI can preview different locations, outfits, lighting styles, and pose directions from two portraits before a real photoshoot.',
      },
      {
        q: 'How do we make engagement photos feel natural?',
        a: 'Use actions instead of static poses: walk, hold hands, adjust the ring, sit close, or look at each other instead of the camera.',
      },
    ],
    related: [
      { label: 'Couple photoshoot ideas', href: '/ideas/couple-photoshoot-ideas' },
      { label: 'Couple photoshoot poses', href: '/ideas/couple-photoshoot-poses' },
      { label: 'Anniversary photo ideas', href: '/ideas/anniversary-photo-ideas' },
    ],
  },
  'valentine-photoshoot-ideas': {
    slug: 'valentine-photoshoot-ideas',
    metadata: {
      title: 'Valentine Photoshoot Ideas for Romantic Couple Photos | Dommi',
      description:
        'Find cute, romantic, cozy, and long-distance Valentine photoshoot ideas. Create Valentine couple photos from two portraits with AI.',
      alternates: { canonical: '/ideas/valentine-photoshoot-ideas' },
      openGraph: {
        title: 'Valentine Photoshoot Ideas for Romantic Couple Photos | Dommi',
        description: 'Romantic Valentine couple photo ideas that feel sweet, polished, and not awkward.',
        url: '/ideas/valentine-photoshoot-ideas',
        type: 'article',
      },
    },
    eyebrow: 'Valentine Couple Studio',
    h1: 'Valentine Photoshoot Ideas for Romantic Couple Photos',
    intro:
      'Create Valentine images for posts, gifts, wallpapers, and long-distance moments without forcing a pose that feels embarrassing.',
    primaryCta: 'Create Valentine Photos',
    secondaryCta: 'See Valentine Looks',
    heroImage: image('13122221'),
    heroAlt: 'Romantic Valentine couple photo scene',
    stats: ['Sweet, not cringe', 'Story and post crops', 'Long-distance friendly'],
    filters: ['Cute', 'Romantic', 'Cozy Home', 'Rose Gift', 'Cafe Date', 'Cinematic', 'Long Distance'],
    ideasIntro:
      'Valentine photos should feel warm and personal. These concepts keep the romance tasteful while still giving the image a clear hook.',
    ideas: [
      {
        title: 'Rose exchange portrait',
        tag: 'Gift',
        image: image('9451327'),
        bestFor: 'Classic Valentine posts and gift-card style images.',
        prompt: 'A sweet Valentine couple portrait with one partner giving roses, soft red accents, warm studio lighting.',
        mistake: 'Avoid filling the frame with props; one clear rose moment is enough.',
      },
      {
        title: 'Cozy couch date',
        tag: 'Home',
        image: image('7555813'),
        bestFor: 'Couples who want an intimate photo without a formal shoot.',
        prompt: 'A cozy Valentine couple photo on a sofa, soft blankets, warm lamp light, relaxed affectionate pose.',
        mistake: 'Do not make the scene look like a furniture catalog; keep it human and close.',
      },
      {
        title: 'Cafe Valentine',
        tag: 'Cafe',
        image: image('28833971'),
        bestFor: 'Casual date-night posts and cute profile photos.',
        prompt: 'A Valentine cafe date couple photo, two drinks, small bouquet, soft film colors, natural smiles.',
        mistake: 'Avoid too many hearts; cafe details should be subtle.',
      },
      {
        title: 'Almost-kiss cinema',
        tag: 'Cinematic',
        image: image('10256506'),
        bestFor: 'Romantic images that feel tasteful instead of overly staged.',
        prompt: 'A cinematic almost-kiss couple portrait, close but subtle, soft side light, elegant romantic tension.',
        mistake: 'Do not push expressions too dramatic; subtle is more believable.',
      },
      {
        title: 'Matching red accent',
        tag: 'Outfit',
        image: image('10593750'),
        bestFor: 'A polished Valentine look without heavy props.',
        prompt: 'A stylish couple portrait with coordinated red accents, clean studio backdrop, editorial Valentine mood.',
        mistake: 'Avoid matching every item; one shared accent color is stronger.',
      },
      {
        title: 'Mirror selfie date',
        tag: 'Social',
        image: image('34193846'),
        bestFor: 'Story posts, lock screens, and casual Valentine content.',
        prompt: 'A cute couple mirror selfie before a Valentine date, coordinated outfits, soft flash, realistic phone photo.',
        mistake: 'Keep the mirror and phone natural; over-polishing can make it feel fake.',
      },
      {
        title: 'Long-distance Valentine',
        tag: 'LDR',
        image: image('4545805'),
        bestFor: 'Couples who cannot be together on Valentine’s Day.',
        prompt: 'A long-distance Valentine couple photo, two separate portraits blended into one warm shared scene, heartfelt mood.',
        mistake: 'Do not overdo fantasy elements if the goal is an emotionally believable image.',
      },
      {
        title: 'Soft pink studio',
        tag: 'Studio',
        image: image('19109107'),
        bestFor: 'Clean, romantic portraits for cards or social posts.',
        prompt: 'A soft pink studio Valentine couple portrait, minimal backdrop, gentle pose, refined romantic styling.',
        mistake: 'Keep the palette balanced; too much pink can look childish.',
      },
    ],
    guideTitle: 'Make Valentine romantic without making it awkward',
    guideIntro:
      'Valentine content works when the emotion feels specific. Choose a scene that fits how the couple actually shows affection.',
    guideSections: [
      {
        title: 'For subtle couples',
        text: 'Use almost-kiss, shoulder lean, hand-holding, and cafe-date prompts.',
        items: ['Almost kiss', 'Cafe date', 'Walking close'],
      },
      {
        title: 'For social posts',
        text: 'Use clear color accents and formats that work as a story, square post, or phone wallpaper.',
        items: ['Red accent portrait', 'Mirror selfie', 'Rose exchange'],
      },
      {
        title: 'For long-distance couples',
        text: 'Create a shared scene from two separate portraits and make it feel like a memory, not a collage.',
        items: ['Shared cafe scene', 'Train station reunion', 'Cozy home portrait'],
      },
    ],
    generatorTitle: 'Create a Valentine photo from two selfies',
    generatorIntro:
      'Pick a sweet, cinematic, or cozy Valentine style and generate a polished couple image from two separate photos.',
    generatorChips: ['Valentine styles', 'Wallpaper crops', 'Caption-ready', 'Private uploads'],
    privacyNote: 'Romantic generation should be consent-first. Use photos from both partners only when you have permission.',
    faqTitle: 'Valentine photoshoot ideas FAQ',
    faqs: [
      {
        q: 'What are cute Valentine photoshoot ideas?',
        a: 'Cafe dates, rose exchanges, cozy couch portraits, mirror selfies, soft studio photos, and almost-kiss cinematic portraits are reliable Valentine ideas.',
      },
      {
        q: 'How can long-distance couples make Valentine photos?',
        a: 'Use two separate portraits and generate a shared Valentine scene, such as a cafe date, home portrait, or reunion moment.',
      },
      {
        q: 'How do I make Valentine photos less cringe?',
        a: 'Choose one romantic detail, keep the pose natural, and use subtle affection like hand-holding, leaning, laughing, or an almost kiss.',
      },
      {
        q: 'Can I make Valentine photos at home?',
        a: 'Yes. A sofa, bed, kitchen, mirror, or warm lamp can create a convincing at-home Valentine mood with minimal styling.',
      },
    ],
    related: [
      { label: 'Anniversary photo ideas', href: '/ideas/anniversary-photo-ideas' },
      { label: 'Couple photoshoot ideas', href: '/ideas/couple-photoshoot-ideas' },
      { label: 'Couple photoshoot poses', href: '/ideas/couple-photoshoot-poses' },
    ],
  },
  'anniversary-photo-ideas': {
    slug: 'anniversary-photo-ideas',
    metadata: {
      title: 'Anniversary Photo Ideas for Couples | Dommi',
      description:
        'Find romantic anniversary photo ideas for gifts, posts, long-distance couples, and wedding anniversaries. Generate meaningful couple photos with AI.',
      alternates: { canonical: '/ideas/anniversary-photo-ideas' },
      openGraph: {
        title: 'Anniversary Photo Ideas for Couples | Dommi',
        description: 'Meaningful anniversary photo ideas for couples, gifts, and long-distance relationships.',
        url: '/ideas/anniversary-photo-ideas',
        type: 'article',
      },
    },
    eyebrow: 'Anniversary Memory Maker',
    h1: 'Anniversary Photo Ideas for Couples',
    intro:
      'Create meaningful couple images for anniversaries, gifts, social posts, and long-distance moments, even if you only have separate photos.',
    primaryCta: 'Create Anniversary Photos',
    secondaryCta: 'Explore Gift Ideas',
    heroImage: image('14424027'),
    heroAlt: 'Anniversary couple keepsake photo with hands and ring',
    stats: ['Gift-ready formats', 'Long-distance mode', 'Separate selfies supported'],
    filters: ['1 Year', 'Wedding Anniversary', 'Long Distance', 'Gift', 'Memory', 'Home', 'Dinner', 'Travel'],
    ideasIntro:
      'Anniversary photos carry emotional weight. The best ideas either recreate a memory, show growth, or create the photo you wish you had together.',
    ideas: [
      {
        title: 'Recreate the first date',
        tag: 'Memory',
        image: image('28833971'),
        bestFor: 'A personal anniversary image with a story behind it.',
        prompt: 'A couple recreating their first date in a cozy cafe, nostalgic film look, warm smiles, meaningful mood.',
        mistake: 'Do not copy every detail too literally; capture the feeling instead.',
      },
      {
        title: 'Then-and-now portrait',
        tag: 'Milestone',
        image: image('4545805'),
        bestFor: 'Relationship milestones and wedding anniversaries.',
        prompt: 'A tasteful then-and-now anniversary couple portrait, two eras blended in a clean editorial composition.',
        mistake: 'Keep both moments visually balanced so it does not look like a random collage.',
      },
      {
        title: 'Framed photo gift',
        tag: 'Gift',
        image: image('9451327'),
        bestFor: 'Printable gifts, cards, and surprise keepsakes.',
        prompt: 'A romantic couple portrait designed as a framed anniversary gift, soft neutral background, timeless styling.',
        mistake: 'Avoid tiny faces; printable gifts need clear expressions.',
      },
      {
        title: 'Long-distance reunion',
        tag: 'Long Distance',
        image: image('13122221'),
        bestFor: 'Couples who cannot take a new photo together.',
        prompt: 'A long-distance couple reunion photo, emotional hug at an airport, realistic faces, warm cinematic light.',
        mistake: 'Keep it believable; too much drama can reduce the emotional impact.',
      },
      {
        title: 'Candlelight dinner',
        tag: 'Dinner',
        image: image('7555813'),
        bestFor: 'Romantic anniversary posts and private images.',
        prompt: 'A couple at a candlelight anniversary dinner, close composition, warm glow, elegant intimate restaurant mood.',
        mistake: 'Avoid dark faces; candlelight needs soft fill light.',
      },
      {
        title: 'Wedding anniversary editorial',
        tag: 'Wedding',
        image: image('14424027'),
        bestFor: 'Married couples celebrating a major year.',
        prompt: 'A wedding anniversary editorial portrait, elegant formal outfits, subtle ring detail, timeless soft lighting.',
        mistake: 'Do not make it feel like a new wedding unless that is the intent.',
      },
      {
        title: 'Travel memory scene',
        tag: 'Travel',
        image: image('3030595'),
        bestFor: 'Couples with a favorite city, beach, or dream trip.',
        prompt: 'A couple anniversary travel portrait in a dream destination, warm sunset, candid embrace, postcard mood.',
        mistake: 'Pick one recognizable location cue instead of many competing landmarks.',
      },
      {
        title: 'Old-photo film style',
        tag: 'Vintage',
        image: image('4545805'),
        bestFor: 'Nostalgic gifts and understated romantic posts.',
        prompt: 'A vintage film anniversary couple portrait, gentle grain, soft faded colors, timeless candid expression.',
        mistake: 'Do not make the image look damaged; keep it nostalgic but polished.',
      },
    ],
    guideTitle: 'Make an anniversary image feel personal',
    guideIntro:
      'The strongest anniversary photo is not always the fanciest one. It is the one that feels like it could only belong to that couple.',
    guideSections: [
      {
        title: 'If you have separate photos',
        text: 'Use a shared scene prompt and a simple pose so the final image feels like a real moment.',
        items: ['Airport reunion', 'Cozy sofa', 'Studio portrait'],
      },
      {
        title: 'If it is a gift',
        text: 'Prioritize clear faces, printable framing, and a mood that matches the relationship.',
        items: ['Framed portrait', 'Phone wallpaper', 'Card cover'],
      },
      {
        title: 'If it is a public post',
        text: 'Choose a style that reads instantly in a feed and pair it with a short, sincere caption.',
        items: ['Then-and-now', 'Dinner date', 'Travel memory'],
      },
    ],
    generatorTitle: 'Create a meaningful anniversary photo',
    generatorIntro:
      'Use two portraits to generate a keepsake-style image for a gift, post, wallpaper, or private memory.',
    generatorChips: ['Gift formats', 'Long-distance scenes', 'Printable crops', 'Caption-ready'],
    privacyNote: 'Anniversary images can be intimate. Keep generated photos private unless both people are comfortable sharing them.',
    faqTitle: 'Anniversary photo ideas FAQ',
    faqs: [
      {
        q: 'What photo can I make for an anniversary gift?',
        a: 'A framed couple portrait, first-date recreation, then-and-now image, travel memory, or long-distance reunion scene can all work as meaningful anniversary gifts.',
      },
      {
        q: 'Can AI make anniversary photos from separate selfies?',
        a: 'Yes. Upload two clear portraits and choose a shared scene such as a cafe, dinner table, studio portrait, beach, or reunion moment.',
      },
      {
        q: 'What are good wedding anniversary photo ideas?',
        a: 'Try formal editorial portraits, ring-detail close-ups, recreated wedding moments, dinner scenes, travel portraits, or vintage film-style images.',
      },
      {
        q: 'How do I make an anniversary photo feel personal?',
        a: 'Reference a real memory, shared location, favorite outfit style, or relationship milestone instead of using a generic romantic prompt.',
      },
    ],
    related: [
      { label: 'Valentine photoshoot ideas', href: '/ideas/valentine-photoshoot-ideas' },
      { label: 'Couple photoshoot ideas', href: '/ideas/couple-photoshoot-ideas' },
      { label: 'Engagement photoshoot ideas', href: '/ideas/engagement-photoshoot-ideas' },
    ],
  },
  'couple-photoshoot-poses': {
    slug: 'couple-photoshoot-poses',
    metadata: {
      title: 'Couple Photoshoot Poses That Look Natural | Dommi',
      description:
        'Browse easy, romantic, sitting, walking, and shy couple poses. Use AI to generate natural couple photos without awkward posing.',
      alternates: { canonical: '/ideas/couple-photoshoot-poses' },
      openGraph: {
        title: 'Couple Photoshoot Poses That Look Natural | Dommi',
        description: 'Simple couple pose ideas with prompt directions for natural AI-generated couple photos.',
        url: '/ideas/couple-photoshoot-poses',
        type: 'article',
      },
    },
    eyebrow: 'Natural Pose Guide',
    h1: 'Couple Photoshoot Poses That Look Natural, Not Awkward',
    intro:
      'Choose easy couple poses with clear direction, then generate the pose with two portraits instead of guessing where to put your hands.',
    primaryCta: 'Generate Couple Poses',
    secondaryCta: 'See Pose Cards',
    heroImage: image('34193846'),
    heroAlt: 'Couple walking together in a natural pose',
    stats: ['Easy pose directions', 'Shy-couple friendly', 'Prompt-ready cards'],
    filters: ['Easy', 'Romantic', 'Sitting', 'Walking', 'Hugging', 'Engagement', 'Shy Couples'],
    ideasIntro:
      'The best poses give the couple something to do. Use these cards as direct AI prompt starters or as direction for a real shoot.',
    ideas: [
      {
        title: 'Walking hand in hand',
        tag: 'Easy',
        image: image('4545805'),
        bestFor: 'Couples who feel awkward standing still.',
        prompt: 'A couple walking hand in hand, slight motion, natural smiles, soft golden light, candid composition.',
        mistake: 'Do not make both people face the camera straight on; let the walk create shape.',
      },
      {
        title: 'Forehead touch',
        tag: 'Romantic',
        image: image('10256506'),
        bestFor: 'A quiet romantic photo that is intimate but not too intense.',
        prompt: 'A couple gently touching foreheads, eyes relaxed, close portrait, soft side light, tender mood.',
        mistake: 'Avoid pressing faces too flat; leave a little space and natural posture.',
      },
      {
        title: 'Back hug',
        tag: 'Hugging',
        image: image('13122221'),
        bestFor: 'Warm, protective, affectionate couple portraits.',
        prompt: 'A natural back hug couple pose, one partner wrapping arms gently from behind, soft smiles, cozy light.',
        mistake: 'Hands should look relaxed, not clenched or hidden awkwardly.',
      },
      {
        title: 'Sitting close',
        tag: 'Sitting',
        image: image('7555813'),
        bestFor: 'Indoor sessions and shy couples who want a relaxed pose.',
        prompt: 'A couple sitting close together on a sofa, shoulders touching, relaxed hands, warm candid portrait.',
        mistake: 'Do not leave too much space between bodies; closeness creates the relationship cue.',
      },
      {
        title: 'Look at each other',
        tag: 'Shy',
        image: image('4545805'),
        bestFor: 'People who do not like looking into the camera.',
        prompt: 'A couple looking at each other and laughing softly, natural eye contact, candid outdoor portrait.',
        mistake: 'Avoid exaggerated laughter; small expressions often look more real.',
      },
      {
        title: 'One leads the other',
        tag: 'Motion',
        image: image('28833971'),
        bestFor: 'Playful engagement and travel-style photos.',
        prompt: 'A playful couple pose where one partner gently leads the other by the hand, street scene, candid motion.',
        mistake: 'Keep the hand connection visible; it is the whole point of the pose.',
      },
      {
        title: 'Dancing candid',
        tag: 'Playful',
        image: image('10593750'),
        bestFor: 'Couples who want joy and movement rather than perfect symmetry.',
        prompt: 'A couple dancing casually together, slight motion blur, joyful expressions, warm evening light.',
        mistake: 'Do not freeze the pose too much; dancing should show movement.',
      },
      {
        title: 'Ring hand close-up',
        tag: 'Engagement',
        image: image('14424027'),
        bestFor: 'Engagement, anniversary, and wedding-style images.',
        prompt: 'A close-up engagement pose with both hands together, ring visible, faces softly blurred in background.',
        mistake: 'Hands need to look relaxed; stiff fingers make the image feel staged.',
      },
    ],
    guideTitle: 'How to pose without looking stiff',
    guideIntro:
      'A natural couple pose is usually a small action, not a frozen shape. Give the body a direction and the expression has something to follow.',
    guideSections: [
      {
        title: 'Keep hands busy',
        text: 'Hands can hold, touch, adjust, lean, or rest. Empty hands are what make many couple poses feel awkward.',
        items: ['Hold hands', 'Touch the ring', 'Rest on shoulder'],
      },
      {
        title: 'Use angles',
        text: 'Turn bodies slightly toward each other and avoid two straight vertical silhouettes side by side.',
        items: ['Shoulder angle', 'One person seated', 'One person leading'],
      },
      {
        title: 'Add tiny motion',
        text: 'Walking, dancing, laughing, and adjusting clothes make the image feel less posed.',
        items: ['Walk slowly', 'Spin once', 'Lean in'],
      },
    ],
    generatorTitle: 'Choose a pose and generate it',
    generatorIntro:
      'Pick a pose card, upload two portraits, and use the prompt direction to create a natural-looking couple image.',
    generatorChips: ['Pose presets', 'Natural expressions', 'Shy-couple friendly', 'Prompt guidance'],
    privacyNote: 'Pose generation still uses real faces. Keep photos private and use images you have permission to upload.',
    faqTitle: 'Couple photoshoot poses FAQ',
    faqs: [
      {
        q: 'How should couples pose for photos?',
        a: 'Couples should use simple interactions: walking, holding hands, leaning, sitting close, looking at each other, hugging, or dancing. These poses create natural body language.',
      },
      {
        q: 'What are easy poses for shy couples?',
        a: 'Walking hand in hand, sitting close, shoulder leaning, looking away together, or holding hands while facing each other are easy because they do not require big expressions.',
      },
      {
        q: 'How do couples pose without looking awkward?',
        a: 'Avoid standing flat beside each other. Turn bodies slightly, keep hands occupied, add small movement, and look at each other instead of always looking at the camera.',
      },
      {
        q: 'Can AI generate couple photos in a specific pose?',
        a: 'Yes. A clear pose prompt can guide the generated image, especially when the pose is simple and both uploaded portraits are clear.',
      },
    ],
    related: [
      { label: 'Couple photoshoot ideas', href: '/ideas/couple-photoshoot-ideas' },
      { label: 'Engagement photoshoot ideas', href: '/ideas/engagement-photoshoot-ideas' },
      { label: 'Valentine photoshoot ideas', href: '/ideas/valentine-photoshoot-ideas' },
    ],
  },
}

export function getCoupleLandingData(slug: string) {
  const data = coupleLandingPages[slug]
  if (!data) {
    throw new Error(`Unknown couple landing page: ${slug}`)
  }
  return data
}
