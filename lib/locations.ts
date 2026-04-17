export interface Location {
  slug: string;
  name: string;
  postcode?: string;
  borough?: string;
  description: string;
}

export const locations: Location[] = [
  // Surrey Belt / South West London
  { slug: 'new-malden', name: 'New Malden', postcode: 'KT3', borough: 'Kingston upon Thames', description: 'New Malden and Kingston border area' },
  { slug: 'kingston-upon-thames', name: 'Kingston upon Thames', postcode: 'KT1', borough: 'Kingston upon Thames', description: 'Kingston town centre and surrounding areas' },
  { slug: 'wimbledon', name: 'Wimbledon', postcode: 'SW19', borough: 'Merton', description: 'Wimbledon and South Wimbledon' },
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
  { slug: 'richmond', name: 'Richmond', postcode: 'TW9', borough: 'Richmond upon Thames', description: 'Richmond upon Thames' },
  // South London
  { slug: 'croydon', name: 'Croydon', postcode: 'CR0', borough: 'Croydon', description: 'Croydon town centre and surrounding areas' },
  { slug: 'tooting', name: 'Tooting', postcode: 'SW17', borough: 'Wandsworth', description: 'Tooting Broadway and Tooting Bec' },
  { slug: 'balham', name: 'Balham', postcode: 'SW12', borough: 'Wandsworth', description: 'Balham High Road area' },
  { slug: 'streatham', name: 'Streatham', postcode: 'SW16', borough: 'Lambeth', description: 'Streatham High Road and surrounding' },
  { slug: 'clapham', name: 'Clapham', postcode: 'SW4', borough: 'Lambeth', description: 'Clapham Common and Clapham South' },
  { slug: 'brixton', name: 'Brixton', postcode: 'SW9', borough: 'Lambeth', description: 'Brixton and Stockwell' },
  { slug: 'vauxhall', name: 'Vauxhall', postcode: 'SW8', borough: 'Lambeth', description: 'Vauxhall and Nine Elms' },
  { slug: 'battersea', name: 'Battersea', postcode: 'SW11', borough: 'Wandsworth', description: 'Battersea and Clapham Junction' },
  { slug: 'putney', name: 'Putney', postcode: 'SW15', borough: 'Wandsworth', description: 'Putney and Roehampton' },
  { slug: 'bromley', name: 'Bromley', postcode: 'BR1', borough: 'Bromley', description: 'Bromley town centre' },
  { slug: 'beckenham', name: 'Beckenham', postcode: 'BR3', borough: 'Bromley', description: 'Beckenham and Elmers End' },
  // Central / West London
  { slug: 'chelsea', name: 'Chelsea', postcode: 'SW3', borough: 'Kensington and Chelsea', description: 'Chelsea and Knightsbridge' },
  { slug: 'fulham', name: 'Fulham', postcode: 'SW6', borough: 'Hammersmith and Fulham', description: 'Fulham Broadway and Parsons Green' },
  { slug: 'hammersmith', name: 'Hammersmith', postcode: 'W6', borough: 'Hammersmith and Fulham', description: 'Hammersmith and Shepherds Bush' },
  { slug: 'earls-court', name: 'Earls Court', postcode: 'SW5', borough: 'Kensington and Chelsea', description: 'Earls Court and West Kensington' },
  { slug: 'kensington', name: 'Kensington', postcode: 'W8', borough: 'Kensington and Chelsea', description: 'Kensington and Holland Park' },
  // East / SE London
  { slug: 'lewisham', name: 'Lewisham', postcode: 'SE13', borough: 'Lewisham', description: 'Lewisham town centre' },
  { slug: 'catford', name: 'Catford', postcode: 'SE6', borough: 'Lewisham', description: 'Catford and Hither Green' },
  { slug: 'greenwich', name: 'Greenwich', postcode: 'SE10', borough: 'Greenwich', description: 'Greenwich and Blackheath' },
  
  // North London
  { slug: 'islington', name: 'Islington', postcode: 'N1', borough: 'Islington', description: 'Islington and Angel area' },
  { slug: 'camden', name: 'Camden', postcode: 'NW1', borough: 'Camden', description: 'Camden Town and Chalk Farm' },
  { slug: 'finchley', name: 'Finchley', postcode: 'N3', borough: 'Barnet', description: 'Finchley and Woodhouse' },
  { slug: 'barnet', name: 'Barnet', postcode: 'EN5', borough: 'Barnet', description: 'High Barnet and Chipping Barnet' },
  { slug: 'enfield', name: 'Enfield', postcode: 'EN1', borough: 'Enfield', description: 'Enfield Town and surrounding areas' },
  { slug: 'haringey', name: 'Haringey', postcode: 'N8', borough: 'Haringey', description: 'Haringey and Hornsey' },
  
  // East London
  { slug: 'stratford', name: 'Stratford', postcode: 'E15', borough: 'Newham', description: 'Stratford and Queen Elizabeth Olympic Park' },
  { slug: 'canary-wharf', name: 'Canary Wharf', postcode: 'E14', borough: 'Tower Hamlets', description: 'Canary Wharf and Isle of Dogs' },
  { slug: 'hackney', name: 'Hackney', postcode: 'E8', borough: 'Hackney', description: 'Hackney Central and Dalston' },
  { slug: 'shoreditch', name: 'Shoreditch', postcode: 'E1', borough: 'Hackney', description: 'Shoreditch and Hoxton' },
  { slug: 'ilford', name: 'Ilford', postcode: 'IG1', borough: 'Redbridge', description: 'Ilford and Seven Kings' },
  { slug: 'romford', name: 'Romford', postcode: 'RM1', borough: 'Havering', description: 'Romford town centre' },

  // Further West London & Middlesex
  { slug: 'chiswick', name: 'Chiswick', postcode: 'W4', borough: 'Hounslow', description: 'Chiswick and Turnham Green' },
  { slug: 'ealing', name: 'Ealing', postcode: 'W5', borough: 'Ealing', description: 'Ealing Broadway and West Ealing' },
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
  { slug: 'guildford', name: 'Guildford', postcode: 'GU1', borough: 'Guildford', description: 'Guildford and surrounding areas' }
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
