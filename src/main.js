import JSZip from 'jszip';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import textureCatalog from './data/texture-catalog.json';
import './style.css';

const icon = (name, size=18) => {
  const paths = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    cube:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9"/>',
    spark:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1.1 2.4L22 17l-1.9.8L19 20l-.9-2.2L16 17l2.1-.6L19 14ZM5 3l.9 2.1L8 6l-2.1.9L5 9l-.9-2.1L2 6l2.1-.9L5 3Z"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" transform="translate(-1 -1)"/>',
    plus:'<path d="M12 5v14M5 12h14"/>', search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>', close:'<path d="m18 6-12 12M6 6l12 12"/>',
    box:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', check:'<path d="m5 12 4 4L19 6"/>',
    upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    wand:'<path d="m15 4 5 5M3 21l12-12M9 15l-6 6M17 2l.8 2.2L20 5l-2.2.8L17 8l-.8-2.2L14 5l2.2-.8L17 2ZM6 3l.7 1.3L8 5l-1.3.7L6 7l-.7-1.3L4 5l1.3-.7L6 3Z"/>',
    dots:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    leaf:'<path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z"/><path d="M4 21c2-5 6-9 12-12"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.cube}</svg>`;
};

const categories = [
  {id:'all', name:'Todo', icon:'grid', color:'#a8e563'},
  {id:'entity', name:'Entidades', icon:'spark', color:'#ffbd69', desc:'Criaturas y personajes personalizados'},
  {id:'item', name:'Objetos', icon:'wand', color:'#bca7ff', desc:'Herramientas, armas y objetos'},
  {id:'block', name:'Bloques', icon:'cube', color:'#6fd7c3', desc:'Bloques nuevos o modificados'},
  {id:'recipe', name:'Recetas', icon:'grid', color:'#f58d94', desc:'Crafteos y recetas de cocina'},
  {id:'loot', name:'Botín', icon:'box', color:'#ffcf70', desc:'Tablas de botín y drops'},
  {id:'biome', name:'Biomas', icon:'leaf', color:'#96d778', desc:'Ambientes y generación'},
  {id:'function', name:'Funciones', icon:'settings', color:'#82b6ff', desc:'Comandos y lógica de juego'},
  {id:'effect', name:'Efectos', icon:'spark', color:'#da93ea', desc:'Efectos, partículas y sonidos'},
];
const libraryGroups = [
  {id:'all',name:'Todo',icon:'grid'},
  {id:'15-mobs',name:'Mobs',icon:'spark'},
  {id:'10-items',name:'Objetos',icon:'wand'},
  {id:'20-blocks',name:'Bloques',icon:'cube'},
  {id:'17-structures',name:'Estructuras',icon:'box'},
  {id:'30-paintings',name:'Pinturas',icon:'grid'},
  {id:'40-weapons',name:'Armas',icon:'wand'},
  {id:'50-icons',name:'Iconos',icon:'spark'},
  {id:'60-interface',name:'Interfaz',icon:'settings'},
  {id:'70-titles',name:'Logos',icon:'spark'},
  {id:'72-backgrounds',name:'Fondos',icon:'leaf'},
  {id:'75-gui',name:'GUI',icon:'grid'},
  {id:'80-particles',name:'Partículas',icon:'spark'},
];
const translatedNames={
  allay:'Allay', armadillo:'Armadillo', axolotl:'Ajolote', bat:'Murciélago', bee:'Abeja',
  blaze:'Blaze', bogged:'Bogged', breeze:'Breeze', camel:'Camello', cat:'Gato',
  chicken:'Gallina', cod:'Bacalao', cow:'Vaca', creeper:'Creeper', dolphin:'Delfín',
  donkey:'Burro', drowned:'Ahogado', elder_guardian:'Guardián anciano', enderman:'Enderman',
  ender_dragon:'Dragón del End', evoker:'Invocador', fox:'Zorro', frog:'Rana', ghast:'Ghast',
  goat:'Cabra', guardian:'Guardián', hoglin:'Hoglin', horse:'Caballo', husk:'Husco',
  iron_golem:'Gólem de hierro', llama:'Llama', magma_cube:'Cubo de magma', mooshroom:'Champiñaca',
  mule:'Mula', ocelot:'Ocelote', panda:'Panda', parrot:'Loro', phantom:'Fantasma', pig:'Cerdo',
  piglin:'Piglin', pillager:'Saqueador', polar_bear:'Oso polar', pufferfish:'Pez globo',
  rabbit:'Conejo', ravager:'Devastador', salmon:'Salmón', sheep:'Oveja', shulker:'Shulker',
  silverfish:'Lepisma', skeleton:'Esqueleto', slime:'Slime', sniffer:'Sniffer',
  snow_golem:'Gólem de nieve', spider:'Araña', squid:'Calamar', stray:'Esqueleto glacial',
  strider:'Lavagante', turtle:'Tortuga', vex:'Vex', villager:'Aldeano', vindicator:'Vindicador',
  wandering_trader:'Comerciante errante', warden:'Warden', witch:'Bruja', wither:'Wither',
  wolf:'Lobo', zombie:'Zombi', zombie_villager:'Aldeano zombi',
};
const templates = {
  entity:{label:'Entidad', category:'entity', icon:'🐉', id:'ancient_dragon', name:'Dragón ancestral', subtitle:'Una criatura legendaria que protege tesoros.', color:'#b991ff', fields:[['health','Vida',120],['damage','Daño de ataque',16],['speed','Velocidad',0.28],['is_boss','Es jefe',true]]},
  item:{label:'Objeto', category:'item', icon:'⚔️', id:'crystal_sword', name:'Espada de cristal', subtitle:'Una hoja brillante con gran poder.', color:'#78baff', fields:[['damage','Daño',12],['durability','Durabilidad',850],['max_stack_size','Tamaño de pila',1],['is_food','Se puede comer',false]]},
  block:{label:'Bloque', category:'block', icon:'🧊', id:'moonstone', name:'Piedra lunar', subtitle:'Un mineral raro que brilla en la oscuridad.', color:'#64d9be', fields:[['hardness','Resistencia',3],['light_level','Nivel de luz',9],['flammable','Inflamable',false],['transparent','Transparente',false]]},
  recipe:{label:'Receta', category:'recipe', icon:'🧪', id:'crystal_sword_recipe', name:'Espada de cristal', subtitle:'Combina materiales para crear un objeto.', color:'#ff8d9c', fields:[['input','Ingrediente','minecraft:diamond'],['input2','Segundo ingrediente','minecraft:amethyst_shard'],['output','Resultado','crystal_sword'],['count','Cantidad',1]]},
  loot:{label:'Botín', category:'loot', icon:'🎁', id:'dragon_loot', name:'Botín de dragón', subtitle:'Recompensas al derrotar una criatura.', color:'#ffc76c', fields:[['item','Objeto','minecraft:diamond'],['min','Cantidad mínima',1],['max','Cantidad máxima',4],['chance','Probabilidad (%)',65]]},
  biome:{label:'Bioma', category:'biome', icon:'🌲', id:'crystal_grove', name:'Arboleda cristalina', subtitle:'Un bosque mágico lleno de minerales.', color:'#9bdc79', fields:[['temperature','Temperatura',0.7],['downfall','Lluvia',0.5],['fog_color','Color de niebla','#a3d8d4'],['top_block','Bloque de superficie','minecraft:grass'] ]},
  function:{label:'Función', category:'function', icon:'⌨️', id:'welcome', name:'Bienvenida', subtitle:'Comandos que se ejecutan en el juego.', color:'#83b5ff', fields:[['command','Comando','say ¡Bienvenido a mi mundo!'],['tick','Ejecutar cada tick',false]]},
  effect:{label:'Efecto', category:'effect', icon:'✨', id:'sparkle_trail', name:'Rastro brillante', subtitle:'Una estela de partículas para tu objeto.', color:'#dd9beb', fields:[['particle','Partícula','minecraft:basic_flame_particle'],['duration','Duración (segundos)',8],['sound','Sonido','random.orb'],['color','Color','#b28dff']]},
};
const starter = [
  {...templates.entity, uid:'start-1', id:'ancient_dragon', name:'Dragón ancestral', category:'entity', color:'#b991ff', fields:{health:120, damage:16, speed:0.28, is_boss:true}},
  {...templates.item, uid:'start-2', id:'crystal_sword', name:'Espada de cristal', category:'item', color:'#78baff', fields:{damage:12, durability:850, max_stack_size:1, is_food:false}},
  {...templates.block, uid:'start-3', id:'moonstone', name:'Piedra lunar', category:'block', color:'#64d9be', fields:{hardness:3, light_level:9, flammable:false, transparent:false}},
];
starter[0].iconImage='/textures/library/15-mobs/4-boss/ender-dragon.webp';
starter[1].iconImage='/textures/library/10-items/1-swords/diamond-sword.webp';
starter[2].iconImage='/textures/library/20-blocks/18-decoration/amethyst-block.webp';
let state = {projectName:'Aventura mística', namespace:'mistico', category:'all', query:'', page:'library', libraryCategory:'15-mobs', librarySearch:'', librarySubcategory:'all', libraryLimit:72, assets:structuredClone(starter), modal:null, toastTimer:null};
try { const saved=JSON.parse(localStorage.getItem('craftlab-project')); if(saved?.assets?.length) state={...state,...saved}; } catch {}
const save = () => localStorage.setItem('craftlab-project', JSON.stringify({...state, modal:null}));
const slug = value => (value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9_]+/g,'_').replace(/^_|_$/g,'') || 'mi_addon';
const getCat = id => categories.find(c=>c.id===id) || categories[1];
const safe = text => String(text ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const itemCard = item => `<article class="asset-card" style="--card-accent:${item.color}">
  <div class="asset-art ${item.category}">${item.iconImage?`<img src="${safe(item.iconImage)}" alt="${safe(item.name)}" loading="lazy">`:`<span>${item.icon}</span>`}<div class="art-glow"></div></div>
  <div class="asset-info"><div class="asset-topline"><span class="asset-category">${getCat(item.category).name}</span><button class="icon-button tiny more-btn" data-menu="${item.uid}" aria-label="Más opciones">${icon('dots',17)}</button></div>
  <h3>${safe(item.name)}</h3><p>${safe(item.subtitle)}</p><div class="asset-meta"><code>${safe(item.fields?.base&&item.fields.base!=='custom'?item.fields.base:`${state.namespace}:${item.id}`)}</code><button class="edit-link" data-edit="${item.uid}">Editar ${icon('chevron',14)}</button></div></div></article>`;
const countText = n => `${n} ${n===1?'elemento':'elementos'}`;
function libraryView(){
  const group=libraryGroups.find(item=>item.id===state.libraryCategory)||libraryGroups[0];
  const categoryItems=state.libraryCategory==='all'?textureCatalog:textureCatalog.filter(item=>item.category===state.libraryCategory);
  const subcategories=[...new Set(categoryItems.map(item=>item.subcategory).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  const query=state.librarySearch.trim().toLowerCase();
  const filtered=categoryItems.filter(item=>(state.librarySubcategory==='all'||item.subcategory===state.librarySubcategory)&&(!query||`${item.name} ${item.slug} ${item.categoryName} ${item.subcategory} ${item.minecraftId||''}`.toLowerCase().includes(query)));
  const visible=filtered.slice(0,state.libraryLimit);
  return `<section class="library-hero"><div class="library-hero-copy"><div class="eyebrow"><span class="eyebrow-dot"></span> CATÁLOGO VISUAL · BEDROCK</div><h1>Todo Minecraft.<br><span>En imágenes.</span></h1><p>Explora mobs, objetos, bloques y miles de recursos con sus imágenes reales. Toca uno para usarlo en tu addon.</p><div class="library-stats"><span><b>${textureCatalog.length.toLocaleString('es')}</b> imágenes</span><i></i><span><b>${libraryGroups.length-1}</b> categorías</span><i></i><span>Funciona sin conexión</span></div></div><div class="library-hero-art"><img src="${textureCatalog.find(item=>item.category==='15-mobs'&&item.slug==='creeper')?.image||''}" alt="Creeper de Minecraft"><div class="art-label">TEXTURAS DE MINECRAFT</div></div></section>
    <section class="library-section"><div class="library-heading"><div><div class="eyebrow section-eyebrow">BIBLIOTECA DE ASSETS</div><h2>Elige una imagen <span class="heading-count">${filtered.length.toLocaleString('es')}</span></h2><p>Imágenes de mobs, entidades, ítems, bloques, estructuras, partículas y más.</p></div><button class="button button-primary" id="go-to-project">${icon('cube',16)} Mi addon <span class="library-project-count">${state.assets.length}</span></button></div>
    <div class="library-toolbar"><div class="library-tabs">${libraryGroups.map(item=>`<button class="library-tab ${state.libraryCategory===item.id?'selected':''}" data-library-category="${item.id}">${icon(item.icon,15)}<span>${item.name}</span><small>${item.id==='all'?textureCatalog.length:textureCatalog.filter(asset=>asset.category===item.id).length}</small></button>`).join('')}</div>
    <div class="library-filters"><label class="search-box library-search">${icon('search',17)}<input id="library-search" placeholder="Buscar mob, ítem, bloque..." value="${safe(state.librarySearch)}"><kbd>⌘ K</kbd></label>${subcategories.length?`<label class="subcategory-select"><span>Subcategoría</span><select id="library-subcategory"><option value="all">Todas</option>${subcategories.map(value=>`<option value="${safe(value)}" ${state.librarySubcategory===value?'selected':''}>${safe(value)}</option>`).join('')}</select></label>`:''}</div></div>
    <div class="library-results"><span>${group.name} <b>·</b> ${filtered.length.toLocaleString('es')} imágenes</span><span>Catálogo visual offline</span></div>
    ${visible.length?`<div class="texture-grid">${visible.map(textureCard).join('')}</div>`:`<div class="empty-state"><span>⌕</span><h3>No encontramos imágenes</h3><p>Prueba con otro nombre o limpia la búsqueda.</p><button class="button button-quiet" id="clear-library-search">Limpiar búsqueda</button></div>`}
    ${filtered.length>visible.length?`<div class="load-more-row"><button class="button button-quiet" id="load-more-textures">Mostrar más imágenes <span>${Math.min(filtered.length-visible.length,120).toLocaleString('es')}</span></button></div>`:''}
    <footer class="library-credit">Imágenes de la biblioteca visual de Minecraft · recursos de terceros incluidos con atribución. ${icon('spark',13)}</footer></section>`;
}
function textureCard(item){return `<button class="texture-card" data-texture="${safe(item.id)}" aria-label="${safe(item.name)}"><span class="texture-art"><img src="${safe(item.image)}" alt="${safe(item.name)}" loading="lazy" decoding="async"><i>${safe(item.categoryName)}</i><span class="texture-add">${icon('plus',17)}</span></span><span class="texture-copy"><b>${safe(item.name)}</b><small>${safe(item.subcategory)}</small></span></button>`;}

function workspaceView(shown){return `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="eyebrow-dot"></span> TALLER DE CREACIÓN <span class="version">BEDROCK 1.21+</span></div><h1>Tu mundo.<br><span>Tus reglas.</span></h1><p>Crea algo extraordinario. Diseña, personaliza y lleva tus ideas directamente a Minecraft.</p><div class="hero-actions"><button class="button button-primary button-large" id="hero-add">${icon('plus',17)} Crear algo nuevo</button><button class="button button-outline button-large" id="rename-project">${icon('settings',16)} Editar proyecto</button></div></div><div class="hero-scene"><div class="scene-orbit orbit-one"></div><div class="scene-orbit orbit-two"></div><div class="scene-sun"></div><div class="floating-cube cube-one">✦</div><div class="floating-cube cube-two">◆</div><div class="voxel voxel-back"></div><div class="voxel voxel-front"><span>✧</span></div><div class="scene-caption"><i></i> UN UNIVERSO POR CREAR</div></div><div class="hero-grid"></div></section>
      <section class="project-strip"><div class="project-icon">${icon('cube',19)}</div><div class="project-detail"><label>PROYECTO ACTUAL</label><div class="project-title"><h2>${safe(state.projectName)}</h2><button class="text-icon" id="quick-rename" aria-label="Renombrar">${icon('settings',14)}</button></div></div><div class="strip-divider"></div><div class="project-stat"><strong>${state.assets.length.toString().padStart(2,'0')}</strong><span>elementos</span></div><div class="project-stat"><strong>${new Set(state.assets.map(a=>a.category)).size.toString().padStart(2,'0')}</strong><span>categorías</span></div><div class="project-stat version-stat"><strong>1.21+</strong><span>versión destino</span></div><button class="strip-export" id="strip-export">${icon('download',17)} <span>Exportar<br>proyecto</span>${icon('chevron',15)}</button></section>
      <section class="assets-section"><div class="section-heading"><div><div class="eyebrow section-eyebrow">TU COLECCIÓN</div><h2>Elementos del addon <span class="heading-count">${shown.length.toString().padStart(2,'0')}</span></h2><p>Todo lo que hace único a tu mundo, en un solo lugar.</p></div><button class="button button-primary add-main" id="add-asset">${icon('plus',17)} Añadir elemento</button></div>
      <div class="toolbar"><div class="filter-chips">${categories.filter(c=>c.id==='all'||state.assets.some(a=>a.category===c.id)).map(c=>`<button class="filter-chip ${state.category===c.id?'selected':''}" data-category="${c.id}">${c.id!=='all'?`<i style="--chip-color:${c.color}"></i>`:''}${c.name}</button>`).join('')}</div><label class="search-box">${icon('search',16)}<input id="search" placeholder="Buscar elementos..." value="${safe(state.query)}"><kbd>⌘ K</kbd></label></div>
      ${shown.length?`<div class="asset-grid">${shown.map(itemCard).join('')}<button class="new-card" id="new-card"><span class="new-plus">${icon('plus',21)}</span><b>Crear nuevo elemento</b><small>Elige una categoría y empieza a construir</small></button></div>`:`<div class="empty-state"><span>✦</span><h3>${state.query?'No encontramos resultados':'Esta categoría está lista para ti'}</h3><p>${state.query?'Prueba con otro nombre o categoría.':'Añade un elemento y empieza a dar forma a tu mundo.'}</p><button class="button button-primary" id="empty-add">${icon('plus',16)} Añadir elemento</button></div>`}</section>
      <footer class="footer"><span>Hecho para imaginar mundos <b>✦</b></span><span>Minecraft Bedrock · Formato .mcaddon</span></footer>`; }

function render(){
  const shown = state.assets.filter(a=>(state.category==='all'||a.category===state.category) && `${a.name} ${a.id} ${getCat(a.category).name}`.toLowerCase().includes(state.query.toLowerCase()));
  const categoriesHtml = categories.map(c=>`<button class="nav-item ${state.page==='project'&&state.category===c.id?'active':''}" data-category="${c.id}"><span class="nav-icon" style="--nav-color:${c.color}">${icon(c.icon,17)}</span><span>${c.name}</span><span class="nav-count">${c.id==='all'?state.assets.length:state.assets.filter(a=>a.category===c.id).length}</span></button>`).join('');
  const pageContent=state.page==='library'?libraryView():workspaceView(shown);
  document.querySelector('#app').innerHTML = `<aside class="sidebar"><div class="brand"><div class="brand-mark">${icon('cube',22)}</div><div><b class="brand-name">Addons<span> Maker</span></b><small>FOR MINECRAFT BEDROCK</small></div><button class="icon-button sidebar-collapse" title="Contraer menú">${icon('menu',18)}</button></div>
    <div class="side-label">TU ESPACIO</div><nav class="primary-nav"><button class="nav-item ${state.page==='library'?'active':''}" data-view="library"><span class="nav-icon library-nav-icon">${icon('spark',17)}</span><span>Biblioteca visual</span><span class="nav-count">${textureCatalog.length.toLocaleString('es')}</span></button><button class="nav-item ${state.page==='project'?'active':''}" data-view="project"><span class="nav-icon">${icon('cube',17)}</span><span>Mi addon</span><span class="nav-count">${state.assets.length}</span></button></nav>
    <div class="side-label category-label">ELEMENTOS <button class="side-plus" id="add-category" title="Añadir contenido">${icon('plus',15)}</button></div><nav>${categoriesHtml}</nav>
    <div class="sidebar-bottom"><div class="help-card"><div class="help-icon">✦</div><b>¿Primera vez?</b><p>Tu addon se exporta listo para importar en Minecraft.</p><button id="show-help">Ver cómo funciona ${icon('chevron',13)}</button></div><button class="profile"><span class="profile-avatar">C</span><span><b>Creador</b><small>Plan gratuito</small></span>${icon('dots',17)}</button></div></aside>
    <main class="main"><header class="topbar"><div class="crumb"><span>${state.page==='library'?'Biblioteca':'Mi addon'}</span>${icon('chevron',14)}<b>${state.page==='library'?'Catálogo Minecraft':safe(state.projectName)}</b></div><div class="top-actions"><span class="save-status"><i></i> Guardado</span><button class="icon-button mobile-menu" id="mobile-menu">${icon('menu')}</button><button class="button button-quiet" id="save-project">${icon('download',15)}<span>Guardar proyecto</span></button><button class="button button-quiet" id="import-project">${icon('upload',15)}<span>Importar proyecto</span></button><button class="button button-primary" id="export-addon">${icon('download',16)} Exportar addon</button><input type="file" id="project-file" accept=".json,.mcaddon,.mcpack" hidden></div></header>
<div class="content">${pageContent}</div></main>${state.modal?modalHtml():''}<div class="toast" id="toast"></div>`;
  bind();
}

function modalHtml(){
  const modal=state.modal;
  if(modal.type==='choose') return `<div class="modal-backdrop" data-close><section class="modal choose-modal"><button class="modal-close" data-close>${icon('close')}</button><div class="modal-eyebrow">AMPLÍA TU UNIVERSO</div><h2>¿Qué vas a crear?</h2><p>Elige el tipo de elemento que quieres añadir a tu addon.</p><div class="type-grid">${categories.filter(c=>c.id!=='all').map(c=>`<button class="type-option" data-new="${c.id}" style="--type-accent:${c.color}"><span>${icon(c.icon,21)}</span><b>${c.name}</b><small>${c.desc}</small>${icon('chevron',15)}</button>`).join('')}</div></section></div>`;
  if(modal.type==='texture'){
    const texture=textureCatalog.find(entry=>entry.id===modal.id);if(!texture)return '';
    const type=texture.category==='15-mobs'?'Entidad':texture.category==='20-blocks'?'Bloque':texture.category==='80-particles'?'Efecto':'Objeto';
    return `<div class="modal-backdrop" data-close><section class="modal texture-modal"><button class="modal-close" data-close>${icon('close')}</button><div class="texture-modal-preview"><img src="${safe(texture.image)}" alt="${safe(texture.name)}"></div><div class="modal-eyebrow">${safe(texture.categoryName.toUpperCase())} · ${safe(texture.subcategory.toUpperCase())}</div><h2>${safe(translatedNames[texture.minecraftId?.replace('minecraft:','')]||texture.name)}</h2><p>Imagen real del catálogo de Minecraft, lista para usar como referencia en tu addon.</p><div class="texture-details"><span>Identificador del catálogo</span><code>${safe(texture.minecraftId||`addon:${slug(texture.slug)}`)}</code><span>Categoría</span><b>${safe(texture.categoryName)} · ${safe(texture.subcategory)}</b></div><div class="modal-actions"><button type="button" class="button button-quiet" data-close>Volver al catálogo</button><div><button type="button" class="button button-primary" data-use-texture="${safe(texture.id)}">${icon('plus',15)} Crear ${type.toLowerCase()}</button>${texture.minecraftId?`<button type="button" class="button button-outline" data-use-texture="${safe(texture.id)}" data-base="true">Modificar original</button>`:''}</div></div><small class="texture-license">Imágenes: Webisso/minecraft-item-icons · licencia MIT. Minecraft es marca de Mojang/Microsoft.</small></section></div>`;
  }
  if(modal.type==='edit'){
    const item=state.assets.find(a=>a.uid===modal.uid); if(!item)return '';
    const fieldDefs=templates[item.category].fields;
    const baseChoices={entity:[['custom','Crear criatura nueva'],['minecraft:zombie','Zombi'],['minecraft:skeleton','Esqueleto'],['minecraft:pig','Cerdo'],['minecraft:cow','Vaca'],['minecraft:creeper','Creeper'],['minecraft:spider','Araña'],['minecraft:villager','Aldeano']],item:[['custom','Crear objeto nuevo'],['minecraft:diamond_sword','Espada de diamante'],['minecraft:iron_sword','Espada de hierro'],['minecraft:bow','Arco'],['minecraft:apple','Manzana'],['minecraft:diamond','Diamante'],['minecraft:shield','Escudo'],['minecraft:iron_pickaxe','Pico de hierro']],block:[['custom','Crear bloque nuevo']]};
    const availableBases=baseChoices[item.category]? [...baseChoices[item.category]]:null;
    if(availableBases&&item.fields.base&&!availableBases.some(([value])=>value===item.fields.base))availableBases.push([item.fields.base,`Base seleccionada · ${item.fields.base}`]);
    return `<div class="modal-backdrop" data-close><section class="modal edit-modal"><button class="modal-close" data-close>${icon('close')}</button><div class="modal-eyebrow">${getCat(item.category).name.toUpperCase()} · PERSONALIZAR</div><h2>${modal.isNew?'Crear':'Editar'} ${templates[item.category].label.toLowerCase()}</h2><p>Define las propiedades de tu elemento.</p>${item.iconImage?`<div class="edit-texture-preview"><img src="${safe(item.iconImage)}" alt="${safe(item.name)}"><span><b>Imagen real seleccionada</b><small>${safe(item.subtitle)}</small></span><button type="button" id="back-to-library">Cambiar</button></div>`:''}<form id="asset-form"><div class="form-row"><label>Nombre visible<input name="name" maxlength="48" value="${safe(item.name)}" required></label><label>Identificador<input name="id" maxlength="48" value="${safe(item.id)}" required pattern="[a-zA-Z0-9_]+"><small>Se usará como ${safe(state.namespace)}:<b id="live-id">${safe(item.id)}</b></small></label></div>${availableBases?`<label class="base-select">Base del juego (opcional)<select name="field_base">${availableBases.map(([v,n])=>`<option value="${v}" ${(item.fields.base||'custom')===v?'selected':''}>${n}</option>`).join('')}</select><small>Al exportar se reemplazará esta entidad, objeto o bloque de Minecraft con tus cambios.</small></label>`:''}<label class="full-label">Descripción<textarea name="subtitle" rows="2" maxlength="110">${safe(item.subtitle)}</textarea></label><div class="field-grid">${fieldDefs.map(([key,label,value])=>{const v=item.fields[key]??value; return typeof value==='boolean'?`<label class="switch-field"><span>${label}</span><input type="checkbox" name="field_${key}" ${v?'checked':''}><i></i></label>`:`<label>${label}<input name="field_${key}" type="${key==='color'?'color':typeof value==='number'?'number':'text'}" ${typeof value==='number'?`step="${key==='speed'||key==='temperature'||key==='downfall'?'0.05':'1'}"`:''} value="${safe(v)}"></label>`;}).join('')}</div><div class="modal-actions"><button type="button" class="button button-danger" id="delete-asset">${icon('close',15)} Eliminar</button><div><button type="button" class="button button-quiet" data-close>Cancelar</button><button class="button button-primary" type="submit">${icon('check',16)} Guardar cambios</button></div></div></form></section></div>`;
  }
  if(modal.type==='rename')return `<div class="modal-backdrop" data-close><section class="modal rename-modal"><button class="modal-close" data-close>${icon('close')}</button><div class="modal-eyebrow">IDENTIDAD DEL PROYECTO</div><h2>Editar proyecto</h2><p>Este nombre aparecerá al importar tu addon en Minecraft.</p><form id="project-form"><label>Nombre del proyecto<input name="projectName" value="${safe(state.projectName)}" maxlength="40" required></label><label>Espacio de nombres<small>Solo letras, números y guion bajo.</small><input name="namespace" value="${safe(state.namespace)}" maxlength="24" pattern="[a-zA-Z0-9_]+" required></label><div class="modal-actions"><span></span><div><button type="button" class="button button-quiet" data-close>Cancelar</button><button class="button button-primary">Guardar proyecto</button></div></div></form></section></div>`;
  return `<div class="modal-backdrop" data-close><section class="modal help-modal"><button class="modal-close" data-close>${icon('close')}</button><div class="modal-eyebrow">DE TU IDEA AL JUEGO</div><h2>Así funciona Addons Maker</h2><p>Tu addon se prepara en un paquete instalable para Minecraft Bedrock.</p><div class="help-steps"><div><b>01</b><span><strong>Crea y personaliza</strong><small>Añade criaturas, objetos, bloques y mucho más.</small></span></div><div><b>02</b><span><strong>Exporta tu addon</strong><small>Descarga un archivo .mcaddon listo para importar.</small></span></div><div><b>03</b><span><strong>Ábrelo con Minecraft</strong><small>En móvil toca el archivo; en PC haz doble clic.</small></span></div></div><div class="modal-actions"><span></span><button class="button button-primary" data-close>¡Entendido!</button></div></section></div>`;
}

function bind(){
  document.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>{state.page=el.dataset.view;render();});
  document.querySelectorAll('[data-category]').forEach(el=>el.onclick=()=>{state.page='project';state.category=el.dataset.category;render();});
  document.querySelectorAll('[data-library-category]').forEach(el=>el.onclick=()=>{state.libraryCategory=el.dataset.libraryCategory;state.librarySubcategory='all';state.libraryLimit=72;render();});
  document.querySelectorAll('[data-texture]').forEach(el=>el.onclick=()=>{state.modal={type:'texture',id:el.dataset.texture};render();});
  document.querySelectorAll('[data-use-texture]').forEach(el=>el.onclick=()=>createFromTexture(el.dataset.useTexture,el.dataset.base==='true'));
  document.getElementById('go-to-project')?.addEventListener('click',()=>{state.page='project';render();});
  document.getElementById('load-more-textures')?.addEventListener('click',()=>{state.libraryLimit+=120;render();});
  document.getElementById('clear-library-search')?.addEventListener('click',()=>{state.librarySearch='';state.librarySubcategory='all';render();});
  document.getElementById('library-subcategory')?.addEventListener('change',e=>{state.librarySubcategory=e.target.value;state.libraryLimit=72;render();});
  const librarySearch=document.getElementById('library-search');librarySearch?.addEventListener('input',e=>{state.librarySearch=e.target.value;state.libraryLimit=72;const pos=e.target.selectionStart;render();const next=document.getElementById('library-search');next?.focus();next?.setSelectionRange(pos,pos);});
  document.querySelectorAll('[data-edit]').forEach(el=>el.onclick=()=>{state.modal={type:'edit',uid:el.dataset.edit};render();});
  document.querySelectorAll('[data-close]').forEach(el=>el.onclick=e=>{if(e.target===el||el.classList.contains('modal-close')){state.modal=null;render();}});
  document.querySelectorAll('[data-new]').forEach(el=>el.onclick=()=>addNew(el.dataset.new));
  ['add-asset','hero-add','new-card','empty-add','add-category'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{state.modal={type:'choose'};render();}));
  ['rename-project','quick-rename'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{state.modal={type:'rename'};render();}));
  document.getElementById('show-help')?.addEventListener('click',()=>{state.modal={type:'help'};render();});
  document.getElementById('back-to-library')?.addEventListener('click',()=>{state.modal=null;state.page='library';render();});
  ['export-addon','strip-export'].forEach(id=>document.getElementById(id)?.addEventListener('click',exportAddon));
  document.getElementById('save-project')?.addEventListener('click',saveProject);
  const search=document.getElementById('search'); search?.addEventListener('input',e=>{state.query=e.target.value;const pos=e.target.selectionStart;render();const next=document.getElementById('search');next.focus();next.setSelectionRange(pos,pos);});
  document.getElementById('mobile-menu')?.addEventListener('click',()=>document.querySelector('.sidebar').classList.toggle('open'));
  document.getElementById('asset-form')?.addEventListener('submit',saveAsset);
  document.getElementById('delete-asset')?.addEventListener('click',()=>{if(confirm('¿Eliminar este elemento del addon?')){state.assets=state.assets.filter(a=>a.uid!==state.modal.uid);state.modal=null;save();render();showToast('Elemento eliminado');}});
  document.getElementById('project-form')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);state.projectName=d.get('projectName').trim();state.namespace=slug(d.get('namespace'));state.modal=null;save();render();showToast('Proyecto actualizado');});
  document.querySelector('[name="id"]')?.addEventListener('input',e=>{const target=document.getElementById('live-id');if(target)target.textContent=slug(e.target.value);});
  document.getElementById('import-project')?.addEventListener('click',()=>document.getElementById('project-file').click());
  document.getElementById('project-file')?.addEventListener('change',importProject);
  document.querySelectorAll('.more-btn').forEach(el=>el.onclick=()=>{const asset=state.assets.find(a=>a.uid===el.dataset.menu);if(asset){state.modal={type:'edit',uid:asset.uid};render();}});
}
function addNew(type){const template=templates[type]; const item={...structuredClone(template),uid:crypto.randomUUID(),fields:Object.fromEntries(template.fields.map(([k,,v])=>[k,v]))};state.assets.unshift(item);state.category=type;state.page='project';state.modal={type:'edit',uid:item.uid,isNew:true};save();render();}
function createFromTexture(id,useBase=false){
  const texture=textureCatalog.find(entry=>entry.id===id);if(!texture)return;
  const type=texture.category==='15-mobs'?'entity':texture.category==='20-blocks'?'block':texture.category==='80-particles'?'effect':'item';
  const template=templates[type], fields=Object.fromEntries(template.fields.map(([key,,value])=>[key,value]));
  if(useBase&&texture.minecraftId&&state.assets.some(asset=>asset.fields?.base===texture.minecraftId)){showToast('Ese elemento vanilla ya está en tu addon');return;}
  const vanillaName=texture.minecraftId?.replace('minecraft:','');
  const displayName=translatedNames[vanillaName]||texture.name;
  if(useBase&&texture.minecraftId)fields.base=texture.minecraftId;
  const idRoot=slug(texture.slug);let assetId=idRoot,suffix=2;while(state.assets.some(asset=>asset.category===type&&asset.id===assetId))assetId=`${idRoot}_${suffix++}`;
  const item={...structuredClone(template),uid:crypto.randomUUID(),id:assetId,name:displayName,subtitle:`${texture.categoryName} · ${texture.subcategory}`,fields,iconImage:texture.image,textureId:texture.id,baseIdentifier:useBase?texture.minecraftId:null};
  state.assets.unshift(item);state.category=type;state.page='project';state.modal={type:'edit',uid:item.uid,isNew:true};save();render();showToast(useBase?'Base de Minecraft añadida al proyecto':'Imagen añadida al proyecto');
}
function saveAsset(e){e.preventDefault();const data=new FormData(e.target);const item=state.assets.find(a=>a.uid===state.modal.uid);item.name=data.get('name').trim();item.id=slug(data.get('id'));item.subtitle=data.get('subtitle').trim();for(const [key,,defaultValue] of templates[item.category].fields){if(typeof defaultValue==='boolean')item.fields[key]=data.get(`field_${key}`)==='on';else if(typeof defaultValue==='number')item.fields[key]=Number(data.get(`field_${key}`));else item.fields[key]=data.get(`field_${key}`);};if(data.has('field_base'))item.fields.base=data.get('field_base');state.modal=null;save();render();showToast('Cambios guardados');}
function showToast(text){const toast=document.getElementById('toast');if(!toast)return;toast.innerHTML=`<span>${icon('check',16)}</span>${text}`;toast.classList.add('visible');clearTimeout(state.toastTimer);state.toastTimer=setTimeout(()=>toast.classList.remove('visible'),2600);}
function uuid(){return crypto.randomUUID();}
const manifest=(name,desc,type,header,modules,dependencies=[])=>({format_version:2,header:{name,description:desc,uuid:header,version:[1,0,0],min_engine_version:[1,20,0]},modules:modules.map((m,i)=>({type:m,uuid:uuid(),version:[1,0,0],...(m==='data'?{description:`${name} behavior pack`}:{})})),...(dependencies.length?{dependencies}: {})});
const fileJson=(zip,path,obj)=>zip.file(path,JSON.stringify(obj,null,2));
async function exportAddon(){
  if(!state.assets.length){showToast('Añade al menos un elemento para exportar');return;}
  const zip=new JSZip(), ns=slug(state.namespace), project=state.projectName.trim()||'Mi addon', bpUuid=uuid(),rpUuid=uuid();
  const bp=zip.folder('behavior_packs').folder(`${ns}_behavior`),rp=zip.folder('resource_packs').folder(`${ns}_resources`),itemTextures={},terrainTextures={};
  fileJson(bp,'manifest.json',manifest(`${project} BP`,'Pack de comportamiento de '+project,'data',bpUuid,['data'],[{uuid:rpUuid,version:[1,0,0]}]));
  fileJson(rp,'manifest.json',manifest(`${project} RP`,'Pack de recursos de '+project,'resources',rpUuid,['resources']));
  for(const a of state.assets){
    const f=a.fields||{};const id=(['entity','item','block'].includes(a.category)&&f.base&&f.base!=='custom')?f.base:`${ns}:${slug(a.id)}`;
    if(a.category==='entity'){
      const components={'minecraft:type_family':{family:[''+ns, 'mob']},'minecraft:health':{value:Number(f.health)||20,max:Number(f.health)||20},'minecraft:collision_box':{width:1.2,height:2},'minecraft:movement':{value:Number(f.speed)||0.25},'minecraft:movement.basic':{},'minecraft:navigation.walk':{can_path_over_water:true,avoid_water:true},'minecraft:physics':{},'minecraft:pushable':{is_pushable:true,is_pushable_by_piston:true},'minecraft:nameable':{},'minecraft:loot':{table:`loot_tables/entities/${slug(a.id)}.json`},'minecraft:attack':{damage:Number(f.damage)||2},'minecraft:behavior.float':{priority:0},'minecraft:behavior.nearest_attackable_target':{priority:2,within_radius:16,must_see:false,entity_types:[{filters:{test:'is_family',subject:'other',value:'player'},max_dist:16}]},'minecraft:behavior.melee_attack':{priority:3,speed_multiplier:1.2},'minecraft:behavior.random_stroll':{priority:6,speed_multiplier:0.8},'minecraft:behavior.look_at_player':{priority:7,look_distance:8},'minecraft:behavior.random_look_around':{priority:8}};
      fileJson(bp,`entities/${slug(a.id)}.json`,{format_version:'1.20.80',"minecraft:entity":{description:{identifier:id,is_spawnable:true,is_summonable:true,is_experimental:false,properties:{}},components}});
      if(!f.base||f.base==='custom')fileJson(rp,`entity/${slug(a.id)}.entity.json`,{format_version:'1.10.0',"minecraft:client_entity":{description:{identifier:id,materials:{default:'entity_alphatest'},textures:{default:'textures/entity/zombie/zombie'},geometry:{default:'geometry.humanoid'},animations:{},scripts:{animate:[]},render_controllers:['controller.render.default'],spawn_egg:{base_color:'#665599',overlay_color:'#ccbbff'}}}});
      fileJson(bp,`loot_tables/entities/${slug(a.id)}.json`,{pools:[{rolls:1,entries:[{type:'item',name:'minecraft:diamond',weight:1}]},{rolls:1,entries:[{type:'item',name:'minecraft:experience_bottle',weight:2}]}]});
    }else if(a.category==='item'){
      const components={'minecraft:icon':{textures:{default:slug(a.id)}},'minecraft:display_name':{value:a.name},'minecraft:max_stack_size':Math.max(1,Math.min(64,Number(f.max_stack_size)||1)),'minecraft:hand_equipped':true,'minecraft:durability':{max_durability:Math.max(1,Number(f.durability)||250)},'minecraft:damage':Math.max(0,Number(f.damage)||1)};
      if(f.is_food)components['minecraft:food']={nutrition:4,saturation_modifier:'normal',can_always_eat:false};
      fileJson(bp,`items/${slug(a.id)}.json`,{format_version:'1.20.80',"minecraft:item":{description:{identifier:id,menu_category:{category:'equipment'}},components}});
      const itemIconPath=`textures/items/${slug(a.id)}`;
      if(a.iconImage)rp.file(`${itemIconPath}.png`,await imageUrlToPng(a.iconImage));
      itemTextures[slug(a.id)]={textures:a.iconImage?itemIconPath:'textures/items/diamond_sword'};
    }else if(a.category==='block'){
      const components={'minecraft:destroy_time':Math.max(0,Number(f.hardness)||1),'minecraft:explosion_resistance':Math.max(0,Number(f.hardness)||1),'minecraft:map_color':f.color||'#8bb2be','minecraft:loot':`loot_tables/blocks/${slug(a.id)}.json`,'minecraft:material_instances':{'*':{texture:slug(a.id),render_method:f.transparent?'blend':'opaque'}}}; if(Number(f.light_level)>0)components['minecraft:light_emission']=Math.min(15,Number(f.light_level));
      if(a.iconImage){const blockTexture=`textures/blocks/${slug(a.id)}`;rp.file(`${blockTexture}.png`,await imageUrlToPng(a.iconImage));terrainTextures[slug(a.id)]={textures:blockTexture};}
      else terrainTextures[slug(a.id)]={textures:'textures/blocks/stone'};
      fileJson(bp,`blocks/${slug(a.id)}.json`,{format_version:'1.20.80',"minecraft:block":{description:{identifier:id,menu_category:{category:'nature',group:'itemGroup.name.nature'}},components}});
      fileJson(bp,`loot_tables/blocks/${slug(a.id)}.json`,{pools:[{rolls:1,entries:[{type:'item',name:id}]}]});
    }else if(a.category==='recipe'){
      fileJson(bp,`recipes/${slug(a.id)}.json`,{format_version:'1.20.10',"minecraft:recipe_shaped":{description:{identifier:id},tags:['crafting_table'],pattern:[' A ',' B ','   '],key:{A:{item:f.input||'minecraft:diamond'},B:{item:f.input2||'minecraft:stick'}},result:{item:`${ns}:${slug(f.output||'custom_item')}`,count:Math.max(1,Number(f.count)||1)}}});
    }else if(a.category==='loot'){
      const chance=Math.min(100,Math.max(0,Number(f.chance)||0))/100;
      fileJson(bp,`loot_tables/${slug(a.id)}.json`,{pools:[{rolls:1,entries:[{type:'item',name:f.item||'minecraft:diamond',weight:1,functions:[{function:'set_count',count:{min:Number(f.min)||1,max:Number(f.max)||1}},{function:'set_damage',damage:0}]}],conditions:[{condition:'random_chance',chance}]}]});
    }else if(a.category==='function'){
      const command=String(f.command||'say Hello').replace(/^\//,'');bp.file(`functions/${slug(a.id)}.mcfunction`,command+'\n');
    }else if(a.category==='biome'){
      fileJson(bp,`biomes/${slug(a.id)}.json`,{format_version:'1.20.80',"minecraft:biome":{description:{identifier:id},components:{'minecraft:climate':{temperature:Number(f.temperature)||0.7,downfall:Number(f.downfall)||0.5},'minecraft:overworld_generation_rules':{}}}});
    }else if(a.category==='effect'){
      bp.file(`functions/effect_${slug(a.id)}.mcfunction`,`particle ${String(f.particle||'minecraft:basic_flame_particle').replace(/^\//,'')} ~ ~1 ~\nplaysound ${String(f.sound||'random.orb').replace(/^\//,'')} @a ~ ~ ~ 1 1\n`);
      bp.file(`README_${slug(a.id)}.txt`,`${a.name}\n${a.subtitle}\nParticle: ${f.particle}\nSound: ${f.sound}\nDuración configurada: ${f.duration} segundos\n\nActiva el efecto desde el juego con /function effect_${slug(a.id)}.`);
    }
  }
  if(Object.keys(itemTextures).length)fileJson(rp,'textures/item_texture.json',{resource_pack_name:ns,texture_name:'atlas.items',texture_data:itemTextures});
  if(Object.keys(terrainTextures).length)fileJson(rp,'textures/terrain_texture.json',{resource_pack_name:ns,texture_name:'atlas.terrain',padding:8,num_mip_levels:4,texture_data:terrainTextures});
  zip.file('README.txt',`${project}\nCreado con Addons Maker para Minecraft Bedrock.\n\nIncluye ${state.assets.length} elementos de addon.\nImportación: abre este archivo con Minecraft Bedrock.\n`);
  const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});await downloadBlob(blob,`${slug(project)}.mcaddon`);showToast('¡Addon listo para importar en Minecraft!');
}
async function imageUrlToPng(url){
  const image=await new Promise((resolve,reject)=>{const node=new Image();node.onload=()=>resolve(node);node.onerror=()=>reject(new Error('No se pudo abrir la imagen'));node.src=url;});
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;canvas.getContext('2d').drawImage(image,0,0);
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('No se pudo convertir la textura')),'image/png'));
}
async function downloadBlob(blob,name){
  if(Capacitor.isNativePlatform()){
    try{
      const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});
      const saved=await Filesystem.writeFile({path:name,directory:Directory.Cache,data:base64,recursive:true});
      await Share.share({title:name,files:[saved.uri],dialogTitle:'Abrir o compartir archivo'});
    }catch{showToast('No se pudo compartir el archivo');}
    return;
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}
async function saveProject(){const data={projectName:state.projectName,namespace:state.namespace,category:'all',query:'',assets:state.assets};await downloadBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),`${slug(state.projectName)}.addonsmaker.json`);showToast('Copia del proyecto descargada');}
async function importProject(e){const file=e.target.files[0];if(!file)return;try{if(file.name.endsWith('.json')){const data=JSON.parse(await file.text());if(!data.assets)throw new Error('not project');state={...state,...data,modal:null};save();render();showToast('Proyecto importado');}else showToast('Importa un proyecto .json exportado desde Addons Maker');}catch{showToast('No se pudo leer este proyecto');}e.target.value='';}
window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();(document.getElementById('library-search')||document.getElementById('search'))?.focus();}if(e.key==='Escape'&&state.modal){state.modal=null;render();}});
render();
