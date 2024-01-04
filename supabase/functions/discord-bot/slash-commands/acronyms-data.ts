// Don't look at me like that, I know
// this is a PoC

export type Acronym = {
    name: string;
    class: string;
    fullName: string;
    weaponName: string;
    type: string;
};

export default [
    { name: 'ALMO', class: 'Gunner', fullName: 'A Little More Oomph', weaponName: 'Leadstorm', type: 'Overclock' },
    { name: 'BB', class: 'Gunner', fullName: 'Big Bertha', weaponName: 'Autocannon', type: 'Overclock' },
    { name: 'BH', class: 'Gunner', fullName: 'Burning Hell', weaponName: 'Leadstorm', type: 'Overclock' },
    { name: 'BH', class: 'Gunner', fullName: 'Bullet Hell', weaponName: 'Leadstorm', type: 'Overclock' },
    { name: 'ER', class: 'Gunner', fullName: 'Elephant Rounds', weaponName: 'Bulldog', type: 'Overclock' },
    { name: 'EV', class: 'Gunner', fullName: 'Exhaust Vectoring', weaponName: 'Leadstorm', type: 'Overclock' },
    { name: 'JFH', class: 'Gunner', fullName: 'Jet Fuel Homebrew', weaponName: 'Hurricane', type: 'Overclock' },
    { name: 'LSLS', class: 'Gunner', fullName: 'Leadstorm', weaponName: 'Leadstorm', type: 'Overclock' },
    { name: 'NTP', class: 'Gunner', fullName: 'Neurotoxin Payload', weaponName: 'Autocannon', type: 'Overclock' },
    { name: 'OFM', class: 'Gunner', fullName: 'Overclocked Firing Mechanism', weaponName: 'Hurricane', type: 'Overclock' },
    { name: 'PBM', class: 'Gunner', fullName: 'Plasma Burster Missiles', weaponName: 'Hurricane', type: 'Overclock' },
    { name: 'TTC', class: 'Gunner', fullName: 'Triple Tech Chamber', weaponName: 'Coilgun', type: 'Overclock' },
    { name: 'VB', class: 'Gunner', fullName: 'Volatile Bullets', weaponName: 'Bulldog', type: 'Overclock' },
    { name: 'AISE', class: 'Scout', fullName: 'AI Stability Engine', weaponName: 'GK2', type: 'Overclock' },
    { name: 'ASS', class: 'Scout', fullName: 'Assisted Stability System', weaponName: 'M1K', type: 'Overclock' },
    { name: 'AV', class: 'Scout', fullName: 'Aggressive Venting', weaponName: 'Drak', type: 'Overclock' },
    { name: 'BOM', class: 'Scout', fullName: 'Bullets of Mercy', weaponName: 'GK2', type: 'Overclock' },
    { name: 'ED', class: 'Scout', fullName: 'Embedded Detonators', weaponName: 'Zhukov', type: 'Overclock' },
    { name: 'EFS', class: 'Scout', fullName: 'Electrocuting Focus Shots', weaponName: 'M1K', type: 'Overclock' },
    { name: 'ER', class: 'Scout', fullName: 'Electrifying Reload', weaponName: 'GK2', type: 'Overclock' },
    { name: 'OFM', class: 'Scout', fullName: 'Overclocked Firing Mechanism', weaponName: 'GK2', type: 'Overclock' },
    { name: 'OPA', class: 'Scout', fullName: 'Overturned Particle Accelerator', weaponName: 'Drak', type: 'Overclock' },
    { name: 'SBB', class: 'Scout', fullName: 'Shield Battery Booster', weaponName: 'Drak', type: 'Overclock' },
    { name: 'SCC', class: 'Scout', fullName: 'Super Cooling Chamber', weaponName: 'M1K', type: 'Overclock' },
    { name: 'TEF', class: 'Scout', fullName: 'Thermal Exhaust Feedback', weaponName: 'Drak', type: 'Overclock' },
    { name: 'WPS', class: 'Scout', fullName: 'White Phosphorous Shells', weaponName: 'Boomstick', type: 'Weapon Mod' },
    { name: 'ABM', class: 'Engineer', fullName: 'Armor Break Module', weaponName: 'PGL', type: 'Weapon Mod' },
    { name: 'CO', class: 'Engineer', fullName: 'Cycle Overload', weaponName: 'Warthog', type: 'Overclock' },
    { name: 'CR', class: 'Engineer', fullName: 'Compact Rounds', weaponName: 'PGL', type: 'Overclock' },
    { name: 'ECR', class: 'Engineer', fullName: 'Explosive Chemical Rounds', weaponName: 'Lok', type: 'Overclock' },
    { name: 'EMD', class: 'Engineer', fullName: 'EM Discharge', weaponName: 'Stubby', type: 'Overclock' },
    { name: 'EMR', class: 'Engineer', fullName: 'EM Refire', weaponName: 'Stubby', type: 'Overclock' },
    { name: 'Exec', class: 'Engineer', fullName: 'Executioner', weaponName: 'Lok', type: 'Overclock' },
    { name: 'HIA', class: 'Engineer', fullName: 'Hydrogen Ion Additive', weaponName: 'Breach Cutter', type: 'Overclock' },
    { name: 'HVC', class: 'Engineer', fullName: 'High Voltage Crossover', weaponName: 'Breach Cutter', type: 'Overclock' },
    { name: 'LWC', class: 'Engineer', fullName: 'Light Weight Cases', weaponName: 'Breach Cutter', type: 'Overclock' },
    { name: 'MPA', class: 'Engineer', fullName: 'Magnetic Pellet Alignment', weaponName: 'Warthog', type: 'Overclock' },
    { name: 'ODB', class: 'Engineer', fullName: 'Overdrive Booster', weaponName: 'Shard Diffractor', type: 'Overclock' },
    { name: 'RC', class: 'Engineer', fullName: 'Roll Control', weaponName: 'Breach Cutter', type: 'Overclock' },
    { name: 'RJ', class: 'Engineer', fullName: 'RJ250 Compound', weaponName: 'PGL', type: 'Overclock' },
    { name: 'RTS', class: 'Engineer', fullName: 'Return to Sender', weaponName: 'Breach Cutter', type: 'Overclock' },
    { name: 'SD', class: 'Engineer', fullName: 'Spinning Death', weaponName: 'Breach Cutter', type: 'Overclock' },
    { name: 'SPC', class: 'Engineer', fullName: 'Stronger Plasma Current', weaponName: 'Breach Cutter', type: 'Overclock' },
    { name: 'TA', class: 'Engineer', fullName: 'Turret Arc', weaponName: 'Stubby', type: 'Overclock' },
    { name: 'VIR', class: 'Engineer', fullName: 'Volatile Impact Reactor', weaponName: 'Shard Diffractor', type: 'Overclock' },
    { name: 'DC', class: 'Driller', fullName: 'Disperser Compound', weaponName: 'Sludge Pump', type: 'Overclock' },
    { name: 'ER', class: 'Driller', fullName: 'Explosive Reload', weaponName: 'Subata', type: 'Overclock' },
    { name: 'ER', class: 'Driller', fullName: 'Energy Rerouting', weaponName: 'Experimental Plasma Charger', type: 'Overclock' },
    { name: 'FM', class: 'Driller', fullName: 'Face Melter', weaponName: 'Crspr', type: 'Overclock' },
    { name: 'FSD', class: 'Driller', fullName: 'Fuel Stream Diffuser', weaponName: 'Crspr', type: 'Overclock' },
    { name: 'HH', class: 'Driller', fullName: 'Heavy Hitter', weaponName: 'Experimental Plasma Charger', type: 'Overclock' },
    { name: 'ITE', class: 'Driller', fullName: 'Improved Thermal Efficiency', weaponName: 'Cryo Cannon', type: 'Overclock' },
    { name: 'MCU', class: 'Driller', fullName: 'Magnetic Cooling Unit', weaponName: 'Experimental Plasma Charger', type: 'Overclock' },
    { name: 'MPS', class: 'Driller', fullName: 'Mega Power Supply', weaponName: 'Colette Wave Cooker', type: 'Overclock' },
    { name: 'PP', class: 'Driller', fullName: 'Persistent Plasma', weaponName: 'Experimental Plasma Charger', type: 'Overclock' },
    { name: 'SF', class: 'Driller', fullName: 'Sticky Fuel', weaponName: 'Crspr', type: 'Overclock' },
    { name: 'VIM', class: 'Driller', fullName: 'Volatile Impact Mixture', weaponName: 'Sludge Pump', type: 'Overclock' },
    { name: 'LCS', class: 'Driller', fullName: 'Liquid Cooling System', weaponName: 'Colette Wave Cooker', type: 'Overclock' },
    { name: 'SFL', class: 'Driller', fullName: 'Super Focus Lens', weaponName: 'Colette Wave Cooker', type: 'Overclock' }
] as Acronym[];