import json
import os
import random

devices = [
  { "name": 'MacBook Air', "category": 'MacBook Repair', "serviceSlug": 'macbook-repair-london', "brand": 'Apple' },
  { "name": 'MacBook Pro', "category": 'MacBook Repair', "serviceSlug": 'macbook-repair-london', "brand": 'Apple' },
  { "name": 'Dell XPS', "category": 'Laptop Repair', "serviceSlug": 'laptop-repair-london', "brand": 'Windows' },
  { "name": 'Lenovo ThinkPad', "category": 'Laptop Repair', "serviceSlug": 'laptop-repair-london', "brand": 'Windows' },
  { "name": 'Gaming PC', "category": 'Gaming PC Repair', "serviceSlug": 'gaming-pc-repair-london', "brand": 'Windows' },
  { "name": 'PlayStation 5', "category": 'PlayStation Repair', "serviceSlug": 'playstation-repair-london', "brand": 'Sony' },
  { "name": 'Xbox Series X', "category": 'Console Repair', "serviceSlug": 'gaming-console-repair-london', "brand": 'Microsoft' },
  { "name": 'Nintendo Switch', "category": 'Console Repair', "serviceSlug": 'gaming-console-repair-london', "brand": 'Nintendo' },
  { "name": 'External Hard Drive', "category": 'Data Recovery', "serviceSlug": 'data-recovery-london', "brand": 'Data' },
  { "name": 'iMac', "category": 'MacBook Repair', "serviceSlug": 'macbook-repair-london', "brand": 'Apple' }
]

issues = [
  { "fault": 'Overheating suddenly', "component": 'Thermals', "externalLink": 'https://www.ifixit.com/Guide/How+to+Apply+Thermal+Paste/744' },
  { "fault": 'Not turning on', "component": 'Logic Board / Power', "externalLink": 'https://support.apple.com/en-gb/102623' },
  { "fault": 'Screen flickering heavily', "component": 'Display', "externalLink": 'https://www.ifixit.com/Device/Mac_Laptop' },
  { "fault": 'Battery not holding charge', "component": 'Battery', "externalLink": 'https://support.apple.com/en-gb/102888' },
  { "fault": 'Making a loud grinding sound', "component": 'Fan/Mechanical', "externalLink": 'https://www.crucial.com/articles/pc-builders/how-to-keep-pc-cool' },
  { "fault": 'Running extremely slow', "component": 'Storage/OS', "externalLink": 'https://support.microsoft.com/en-us/windows/tips-to-improve-pc-performance-in-windows-b3b3ef5b-5953-fb6a-2528-4bbf02f73625' },
  { "fault": 'Keys heavily sticking', "component": 'Keyboard', "externalLink": 'https://support.apple.com/en-gb/102365' },
  { "fault": 'Spilled coffee over it', "component": 'Liquid Damage', "externalLink": 'https://www.ifixit.com/Wiki/Electronics_Water_Damage' },
  { "fault": 'USB ports not responding', "component": 'I/O Ports', "externalLink": 'https://support.microsoft.com/en-us/windows/fix-usb-c-problems-in-windows-f4e0e529-74fc-c8f7-edba-001a20b8d46e' }
]

audiences = ['for Home Workers', 'for Students', 'for Gamers', 'for Photographers', 'in London', 'Advice from Experts', 'Quick Fixes', 'Before You Panic']

blogs = []
index = 0

for i in range(10):
    for j in range(9):
        device = devices[i]
        issue = issues[j]
        audience = audiences[index % len(audiences)]
        
        img = '/images/albert-vinas-F3t-AzyTbyU-unsplash.jpg'
        if 'Laptop' in device['category'] or 'Windows' in device['category'] or 'PC' in device['category']:
            img = '/images/nikolai-chernichenko-s6uS36SF91Y-unsplash.jpg'
        elif 'Console' in device['category'] or 'PlayStation' in device['category']:
            img = '/images/nathan-anderson-KHSPGJ3zP0M-unsplash.jpg'
        elif 'Data' in device['category']:
            img = '/images/samsung-memory-QTW80j6ZK4c-unsplash.jpg'
        elif issue['component'] == 'Liquid Damage':
            img = '/images/revendo-7x0dGJqbfgk-unsplash.jpg'

        title = f"{device['name']} {issue['fault']}? {audience}"
        slug = f"{device['name'].lower().replace(' ', '-')}-{issue['fault'].lower().replace(' ', '-').replace('/', '-')}-{audience.lower().replace(' ', '-')}"

        link = issue['externalLink']
        anchorText = 'Official Troubleshooting Guide'
        if device['brand'] == 'Apple' and 'microsoft' in link:
            link = 'https://support.apple.com/en-gb/mac'
        if device['brand'] == 'Windows' and 'apple' in link:
            link = 'https://support.microsoft.com/en-us/windows'
        if device['brand'] == 'Sony':
            link = 'https://www.playstation.com/en-gb/support/hardware/'
        if device['brand'] == 'Nintendo':
            link = 'https://www.nintendo.co.uk/Support/Nintendo-Switch/Nintendo-Switch-Support-1150821.html'
        
        if 'ifixit' in link: anchorText = 'iFixit Repair Insights'
        if 'apple' in link: anchorText = 'Apple Official Support'
        if 'microsoft' in link: anchorText = 'Microsoft Official Guide'
        if 'playstation' in link: anchorText = 'Sony Official Support'
        
        firstResponse = f"When your {device['name']} starts {issue['fault'].lower()}, the most important thing is to avoid panic. Often, issues related to the {issue['component']} can be addressed with targeted diagnostics rather than fully replacing the unit."

        blueprint = {
            "slug": slug,
            "title": title,
            "excerpt": f"Experiencing {issue['fault'].lower()} with your {device['name']}? Read our expert guide before rushing to buy a replacement.",
            "category": device['category'],
            "serviceSlug": device['serviceSlug'],
            "image": img,
            "readingTime": random.randint(3, 5),
            "firstResponse": firstResponse,
            "whySpeedMatters": f"Speed matters because ignoring a {issue['component']} fault usually causes cascading failures to other parts of the hardware, heavily increasing the eventual cost of repair.",
            "quickChecks": [
                f"Completely power cycle the {device['name']} and disconnect all external cables.",
                "Check for any unusual smells or visual physical damage.",
                "Notice if the fault happens immediately on startup or only under heavy load.",
                f"Refer to the <a href='{link}' target='_blank' rel='noopener noreferrer' class='text-brand hover:underline font-semibold'>{anchorText}</a> for any active recall or basic resets."
            ],
            "engineerChecks": [
                "Complete a thorough multitester diagnosis of the internal board.",
                f"Strip down the chassis to inspect the {issue['component']} for thermal or physical wear.",
                "Measure voltage and power distribution if the device relies on a failing battery or power supply.",
                "Safely extract files and back up existing data before any major replacements."
            ],
            "preventionTips": [
                "Keep the unit away from liquid and direct heat sources.",
                "Always rely on properly rated surge protectors rather than cheap extension leads.",
                "Avoid dropping or forcefully shifting the chassis while it is powered on."
            ]
        }

        blogs.append(blueprint)
        index += 1

with open('/Users/macbook/Documents/GitHub/werepairmac-site/lib/generated_blogs.json', 'w') as f:
    json.dump(blogs, f, indent=2)

print(f"Generated {len(blogs)} blogs successfully!")
