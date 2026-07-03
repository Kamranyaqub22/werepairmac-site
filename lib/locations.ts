export interface Location {
  slug: string;
  name: string;
  postcode?: string;
  borough?: string;
  description: string;
  // Optional genuinely-local copy shown at the top of the area page. Fill this in
  // for priority areas so those pages have unique content rather than a template.
  localIntro?: string;
}

export const locations: Location[] = [
  // Surrey Belt / South West London
  { slug: 'new-malden', name: 'New Malden', postcode: 'KT3', borough: 'Kingston upon Thames', description: 'New Malden and Kingston border area', localIntro: 'New Malden is home base for us, so response times here are the fastest we offer anywhere in London — we can often be at your door in New Malden, Motspur Park or Old Malden within the hour. We regularly help the area\'s many home workers and small businesses along Coombe Road and the High Street with MacBook and laptop repairs without them ever leaving their desk.' },
  { slug: 'kingston-upon-thames', name: 'Kingston upon Thames', postcode: 'KT1', borough: 'Kingston upon Thames', description: 'Kingston town centre and surrounding areas', localIntro: 'We cover all of Kingston upon Thames — from the riverside offices and the Bentall Centre area to the residential streets around Norbiton and Kingston Hill. With Kingston University nearby we see a lot of student MacBooks with cracked screens and failing batteries, and we can usually visit the same day rather than making you carry the machine into town.' },
  { slug: 'wimbledon', name: 'Wimbledon', postcode: 'SW19', borough: 'Merton', description: 'Wimbledon and South Wimbledon', localIntro: 'From Wimbledon Village down to South Wimbledon and Wimbledon Park, we come to your home or office rather than asking you to queue at a shop. We look after a lot of the area\'s professionals working from home around the Common, and can handle everything from a slow iMac to a liquid-damaged MacBook on-site.' },
  { slug: 'raynes-park', name: 'Raynes Park', postcode: 'SW20', borough: 'Merton', description: 'Raynes Park and West Barnes' },
  { slug: 'morden', name: 'Morden', postcode: 'SM4', borough: 'Merton', description: 'Morden and surrounding areas' },
  { slug: 'sutton', name: 'Sutton', postcode: 'SM1', borough: 'Sutton', description: 'Sutton town centre' },
  { slug: 'cheam', name: 'Cheam', postcode: 'SM3', borough: 'Sutton', description: 'Cheam Village and North Cheam' },
  { slug: 'epsom', name: 'Epsom', postcode: 'KT18', borough: 'Epsom and Ewell', description: 'Epsom and Ewell area' },
  { slug: 'ewell', name: 'Ewell', postcode: 'KT17', borough: 'Epsom and Ewell', description: 'Ewell and Nonsuch area' },
  { slug: 'tolworth', name: 'Tolworth', postcode: 'KT6', borough: 'Kingston upon Thames', description: 'Tolworth and Surbiton' },
  { slug: 'surbiton', name: 'Surbiton', postcode: 'KT6', borough: 'Kingston upon Thames', description: 'Surbiton and Hook area' },
  { slug: 'esher', name: 'Esher', postcode: 'KT10', borough: 'Elmbridge', description: 'Esher and Claygate' },
  { slug: 'teddington', name: 'Teddington', postcode: 'TW11', borough: 'Richmond upon Thames', description: 'Teddington and Hampton Wick' },
  { slug: 'twickenham', name: 'Twickenham', postcode: 'TW1', borough: 'Richmond upon Thames', description: 'Twickenham and St Margarets' },
  { slug: 'richmond', name: 'Richmond', postcode: 'TW9', borough: 'Richmond upon Thames', description: 'Richmond upon Thames', localIntro: 'We cover Richmond, Kew and St Margarets with a fully mobile service — ideal for the many media and creative professionals in the area who rely on their Macs for work and can\'t afford days without them. We come to your home studio or office and fix most faults on the spot.' },
  // South London
  { slug: 'croydon', name: 'Croydon', postcode: 'CR0', borough: 'Croydon', description: 'Croydon town centre and surrounding areas', localIntro: 'Croydon\'s tech and business district means a lot of the calls we get here are from offices around East Croydon and small firms that need a laptop or PC back up and running fast. We come to you across Croydon, Addiscombe and Purley — no need to drop anything off or wait days for a workshop.' },
  { slug: 'tooting', name: 'Tooting', postcode: 'SW17', borough: 'Wandsworth', description: 'Tooting Broadway and Tooting Bec' },
  { slug: 'balham', name: 'Balham', postcode: 'SW12', borough: 'Wandsworth', description: 'Balham High Road area' },
  { slug: 'streatham', name: 'Streatham', postcode: 'SW16', borough: 'Lambeth', description: 'Streatham High Road and surrounding' },
  { slug: 'clapham', name: 'Clapham', postcode: 'SW4', borough: 'Lambeth', description: 'Clapham Common and Clapham South', localIntro: 'Clapham is full of young professionals and flat-shares where a broken MacBook or laptop can\'t wait for a shop appointment. We visit homes around Clapham Common, Clapham North and Clapham South evenings and weekends, so a repair fits around your work rather than the other way round.' },
  { slug: 'brixton', name: 'Brixton', postcode: 'SW9', borough: 'Lambeth', description: 'Brixton and Stockwell' },
  { slug: 'vauxhall', name: 'Vauxhall', postcode: 'SW8', borough: 'Lambeth', description: 'Vauxhall and Nine Elms' },
  { slug: 'battersea', name: 'Battersea', postcode: 'SW11', borough: 'Wandsworth', description: 'Battersea and Clapham Junction' },
  { slug: 'putney', name: 'Putney', postcode: 'SW15', borough: 'Wandsworth', description: 'Putney and Roehampton' },
  { slug: 'bromley', name: 'Bromley', postcode: 'BR1', borough: 'Bromley', description: 'Bromley town centre' },
  { slug: 'beckenham', name: 'Beckenham', postcode: 'BR3', borough: 'Bromley', description: 'Beckenham and Elmers End' },
  // Central / West London
  { slug: 'chelsea', name: 'Chelsea', postcode: 'SW3', borough: 'Kensington and Chelsea', description: 'Chelsea and Knightsbridge', localIntro: 'We offer a discreet, professional in-home repair service across Chelsea, Knightsbridge and the King\'s Road area. For residents who\'d rather not hand an expensive Mac to a high-street shop, our engineer comes to you and carries out most repairs on-site while you watch.' },
  { slug: 'fulham', name: 'Fulham', postcode: 'SW6', borough: 'Hammersmith and Fulham', description: 'Fulham Broadway and Parsons Green' },
  { slug: 'hammersmith', name: 'Hammersmith', postcode: 'W6', borough: 'Hammersmith and Fulham', description: 'Hammersmith and Shepherds Bush' },
  { slug: 'earls-court', name: 'Earls Court', postcode: 'SW5', borough: 'Kensington and Chelsea', description: 'Earls Court and West Kensington' },
  { slug: 'kensington', name: 'Kensington', postcode: 'W8', borough: 'Kensington and Chelsea', description: 'Kensington and Holland Park' },
  // East / SE London
  { slug: 'lewisham', name: 'Lewisham', postcode: 'SE13', borough: 'Lewisham', description: 'Lewisham town centre' },
  { slug: 'catford', name: 'Catford', postcode: 'SE6', borough: 'Lewisham', description: 'Catford and Hither Green' },
  { slug: 'greenwich', name: 'Greenwich', postcode: 'SE10', borough: 'Greenwich', description: 'Greenwich and Blackheath' },
  
  // North London
  { slug: 'islington', name: 'Islington', postcode: 'N1', borough: 'Islington', description: 'Islington and Angel area', localIntro: 'Around Angel and Upper Street there are countless startups, agencies and freelancers who live on their Macs. We come to your home or co-working space across Islington, Barnsbury and Canonbury and get you back to work fast — most repairs done on-site in under an hour.' },
  { slug: 'camden', name: 'Camden', postcode: 'NW1', borough: 'Camden', description: 'Camden Town and Chalk Farm' },
  { slug: 'finchley', name: 'Finchley', postcode: 'N3', borough: 'Barnet', description: 'Finchley and Woodhouse' },
  { slug: 'barnet', name: 'Barnet', postcode: 'EN5', borough: 'Barnet', description: 'High Barnet and Chipping Barnet' },
  { slug: 'enfield', name: 'Enfield', postcode: 'EN1', borough: 'Enfield', description: 'Enfield Town and surrounding areas' },
  { slug: 'haringey', name: 'Haringey', postcode: 'N8', borough: 'Haringey', description: 'Haringey and Hornsey' },
  
  // East London
  { slug: 'stratford', name: 'Stratford', postcode: 'E15', borough: 'Newham', description: 'Stratford and Queen Elizabeth Olympic Park' },
  { slug: 'canary-wharf', name: 'Canary Wharf', postcode: 'E14', borough: 'Tower Hamlets', description: 'Canary Wharf and Isle of Dogs', localIntro: 'Canary Wharf runs on laptops, and downtime is expensive. We provide fast on-site laptop, MacBook and PC repair to offices and apartments across the Wharf and the Isle of Dogs, fitting around meetings and working hours so a hardware fault doesn\'t cost you a day.' },
  { slug: 'hackney', name: 'Hackney', postcode: 'E8', borough: 'Hackney', description: 'Hackney Central and Dalston' },
  { slug: 'shoreditch', name: 'Shoreditch', postcode: 'E1', borough: 'Hackney', description: 'Shoreditch and Hoxton' },
  { slug: 'ilford', name: 'Ilford', postcode: 'IG1', borough: 'Redbridge', description: 'Ilford and Seven Kings' },
  { slug: 'romford', name: 'Romford', postcode: 'RM1', borough: 'Havering', description: 'Romford town centre' },

  // Further West London & Middlesex
  { slug: 'chiswick', name: 'Chiswick', postcode: 'W4', borough: 'Hounslow', description: 'Chiswick and Turnham Green' },
  { slug: 'ealing', name: 'Ealing', postcode: 'W5', borough: 'Ealing', description: 'Ealing Broadway and West Ealing', localIntro: 'We cover Ealing Broadway, West Ealing and Ealing Common with a doorstep repair service that suits the area\'s many families and home workers. From a child\'s cracked laptop screen before school to a work MacBook that won\'t boot, we come to you and sort it the same day where we can.' },
  { slug: 'hounslow', name: 'Hounslow', postcode: 'TW3', borough: 'Hounslow', description: 'Hounslow Central and West' },
  { slug: 'uxbridge', name: 'Uxbridge', postcode: 'UB8', borough: 'Hillingdon', description: 'Uxbridge town centre' },
  { slug: 'hayes', name: 'Hayes', postcode: 'UB3', borough: 'Hillingdon', description: 'Hayes and Harlington' },

  // South East London Additions
  { slug: 'dulwich', name: 'Dulwich', postcode: 'SE21', borough: 'Southwark', description: 'Dulwich and West Dulwich' },
  { slug: 'orpington', name: 'Orpington', postcode: 'BR6', borough: 'Bromley', description: 'Orpington and Petts Wood' },
  { slug: 'peckham', name: 'Peckham', postcode: 'SE15', borough: 'Southwark', description: 'Peckham and Nunhead' },
  { slug: 'dartford', name: 'Dartford', postcode: 'DA1', borough: 'Dartford', description: 'Dartford and surrounding areas' },

  // More Surrey / Greater London Border Additions
  { slug: 'weybridge', name: 'Weybridge', postcode: 'KT13', borough: 'Elmbridge', description: 'Weybridge and Oatlands' },
  { slug: 'walton-on-thames', name: 'Walton-on-Thames', postcode: 'KT12', borough: 'Elmbridge', description: 'Walton-on-Thames and Hersham' },
  { slug: 'leatherhead', name: 'Leatherhead', postcode: 'KT22', borough: 'Mole Valley', description: 'Leatherhead and Fetcham' },
  { slug: 'cobham', name: 'Cobham', postcode: 'KT11', borough: 'Elmbridge', description: 'Cobham and Stoke d\'Abernon' },
  { slug: 'dorking', name: 'Dorking', postcode: 'RH4', borough: 'Mole Valley', description: 'Dorking and surrounding villages' },
  { slug: 'woking', name: 'Woking', postcode: 'GU21', borough: 'Woking', description: 'Woking town centre' },
  { slug: 'guildford', name: 'Guildford', postcode: 'GU1', borough: 'Guildford', description: 'Guildford and surrounding areas' },

  // Previously missing London boroughs
  { slug: 'barking', name: 'Barking', postcode: 'IG11', borough: 'Barking and Dagenham', description: 'Barking town centre and Dagenham' },
  { slug: 'bexleyheath', name: 'Bexleyheath', postcode: 'DA6', borough: 'Bexley', description: 'Bexleyheath and Sidcup' },
  { slug: 'wembley', name: 'Wembley', postcode: 'HA9', borough: 'Brent', description: 'Wembley and surrounding areas' },
  { slug: 'harrow', name: 'Harrow', postcode: 'HA1', borough: 'Harrow', description: 'Harrow town centre and Harrow-on-the-Hill' },
  { slug: 'walthamstow', name: 'Walthamstow', postcode: 'E17', borough: 'Waltham Forest', description: 'Walthamstow and surrounding areas' },
  { slug: 'westminster', name: 'Westminster', postcode: 'SW1', borough: 'Westminster', description: 'Westminster, Victoria and Marylebone' },

  // Guildford / Crawley corridor - the areas we cover beyond the M25
  { slug: 'redhill', name: 'Redhill', postcode: 'RH1', borough: 'Reigate and Banstead', description: 'Redhill town centre' },
  { slug: 'reigate', name: 'Reigate', postcode: 'RH2', borough: 'Reigate and Banstead', description: 'Reigate and surrounding areas' },
  { slug: 'banstead', name: 'Banstead', postcode: 'SM7', borough: 'Reigate and Banstead', description: 'Banstead and surrounding areas' },
  { slug: 'caterham', name: 'Caterham', postcode: 'CR3', borough: 'Tandridge', description: 'Caterham and Whyteleafe' },
  { slug: 'oxted', name: 'Oxted', postcode: 'RH8', borough: 'Tandridge', description: 'Oxted and Limpsfield' },
  { slug: 'staines', name: 'Staines', postcode: 'TW18', borough: 'Spelthorne', description: 'Staines-upon-Thames and surrounding areas' },
  { slug: 'egham', name: 'Egham', postcode: 'TW20', borough: 'Runnymede', description: 'Egham and Englefield Green' },
  { slug: 'chertsey', name: 'Chertsey', postcode: 'KT16', borough: 'Runnymede', description: 'Chertsey town centre' },
  { slug: 'addlestone', name: 'Addlestone', postcode: 'KT15', borough: 'Runnymede', description: 'Addlestone and New Haw' },
  { slug: 'crawley', name: 'Crawley', postcode: 'RH10', borough: 'Crawley', description: 'Crawley town centre and Gatwick area' }
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

// Postcode-area letters (e.g. "KT" from "KT3") are a good geographic proximity
// signal. We surface genuinely nearby areas on each location page so every page
// has a unique block of internal links and localised content rather than a pure
// template — this avoids the thin/duplicate-content SEO problem.
function postcodeArea(postcode?: string): string {
  return (postcode || '').replace(/[0-9].*$/, '').toUpperCase();
}

export function getNearbyLocations(slug: string, limit = 6): Location[] {
  const current = getLocation(slug);
  if (!current) return [];

  const currentArea = postcodeArea(current.postcode);
  const others = locations.filter((l) => l.slug !== current.slug);

  const scored = others
    .map((l) => {
      let score = 0;
      if (l.borough && l.borough === current.borough) score += 3;
      if (currentArea && postcodeArea(l.postcode) === currentArea) score += 2;
      return { location: l, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const nearby = scored.map((entry) => entry.location);

  // Fall back to a few other London areas if a location has no scored neighbours,
  // so the "areas we also cover" block is never empty.
  if (nearby.length < limit) {
    for (const l of others) {
      if (nearby.length >= limit) break;
      if (!nearby.includes(l)) nearby.push(l);
    }
  }

  return nearby.slice(0, limit);
}
