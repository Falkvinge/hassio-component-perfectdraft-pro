function e(e,t,r,s){var i,a=arguments.length,o=a<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,r):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,s);else for(var n=e.length-1;n>=0;n--)(i=e[n])&&(o=(a<3?i(o):a>3?i(t,r,o):i(t,r))||o);return a>3&&o&&Object.defineProperty(t,r,o),o}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,r=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let a=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(r&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&i.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const r=1===e.length?e[0]:t.reduce((t,r,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[s+1],e[0]);return new a(r,e,s)},n=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:g,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,y=m?m.emptyScript:"",f=u.reactiveElementPolyfillSupport,b=(e,t)=>e,F={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},v=(e,t)=>!l(e,t),_={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(e,r,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){const{get:s,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const a=s?.call(this);i?.call(this,t),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...g(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const r=this._$Eu(e,t);void 0!==r&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(r)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const r of s){const s=document.createElement("style"),i=t.litNonce;void 0!==i&&s.setAttribute("nonce",i),s.textContent=r.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(void 0!==s&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:F).toAttribute(t,r.type);this._$Em=e,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){const r=this.constructor,s=r._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=r.getPropertyOptions(s),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:F;this._$Em=s;const a=i.fromAttribute(t,e.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,r,s=!1,i){if(void 0!==e){const a=this.constructor;if(!1===s&&(i=this[e]),r??=a.getPropertyOptions(e),!((r.hasChanged??v)(i,t)||r.useDefault&&r.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:i},a){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,r,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,f?.({ReactiveElement:x}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=e=>e,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,k="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+P,S=`<${C}>`,B=document,I=()=>B.createComment(""),D=e=>null===e||"object"!=typeof e&&"function"!=typeof e,z=Array.isArray,L="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,H=/>/g,j=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,R=/"/g,G=/^(?:script|style|textarea|title)$/i,N=(e=>(t,...r)=>({_$litType$:e,strings:t,values:r}))(1),U=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,K=B.createTreeWalker(B,129);function q(e,t){if(!z(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const J=(e,t)=>{const r=e.length-1,s=[];let i,a=2===t?"<svg>":3===t?"<math>":"",o=M;for(let t=0;t<r;t++){const r=e[t];let n,l,c=-1,d=0;for(;d<r.length&&(o.lastIndex=d,l=o.exec(r),null!==l);)d=o.lastIndex,o===M?"!--"===l[1]?o=T:void 0!==l[1]?o=H:void 0!==l[2]?(G.test(l[2])&&(i=RegExp("</"+l[2],"g")),o=j):void 0!==l[3]&&(o=j):o===j?">"===l[0]?(o=i??M,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,n=l[1],o=void 0===l[3]?j:'"'===l[3]?R:O):o===R||o===O?o=j:o===T||o===H?o=M:(o=j,i=void 0);const h=o===j&&e[t+1].startsWith("/>")?" ":"";a+=o===M?r+S:c>=0?(s.push(n),r.slice(0,c)+k+r.slice(c)+P+h):r+P+(-2===c?t:h)}return[q(e,a+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let i=0,a=0;const o=e.length-1,n=this.parts,[l,c]=J(e,t);if(this.el=Y.createElement(l,r),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=K.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(k)){const t=c[a++],r=s.getAttribute(e).split(P),o=/([.?@])?(.*)/.exec(t);n.push({type:1,index:i,name:o[2],strings:r,ctor:"."===o[1]?te:"?"===o[1]?re:"@"===o[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(P)&&(n.push({type:6,index:i}),s.removeAttribute(e));if(G.test(s.tagName)){const e=s.textContent.split(P),t=e.length-1;if(t>0){s.textContent=A?A.emptyScript:"";for(let r=0;r<t;r++)s.append(e[r],I()),K.nextNode(),n.push({type:2,index:++i});s.append(e[t],I())}}}else if(8===s.nodeType)if(s.data===C)n.push({type:2,index:i});else{let e=-1;for(;-1!==(e=s.data.indexOf(P,e+1));)n.push({type:7,index:i}),e+=P.length-1}i++}}static createElement(e,t){const r=B.createElement("template");return r.innerHTML=e,r}}function Z(e,t,r=e,s){if(t===U)return t;let i=void 0!==s?r._$Co?.[s]:r._$Cl;const a=D(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),void 0===a?i=void 0:(i=new a(e),i._$AT(e,r,s)),void 0!==s?(r._$Co??=[])[s]=i:r._$Cl=i),void 0!==i&&(t=Z(e,i._$AS(e,t.values),i,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??B).importNode(t,!0);K.currentNode=s;let i=K.nextNode(),a=0,o=0,n=r[0];for(;void 0!==n;){if(a===n.index){let t;2===n.type?t=new X(i,i.nextSibling,this,e):1===n.type?t=new n.ctor(i,n.name,n.strings,this,e):6===n.type&&(t=new ie(i,this,e)),this._$AV.push(t),n=r[++o]}a!==n?.index&&(i=K.nextNode(),a++)}return K.currentNode=B,s}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),D(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>z(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,s="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Y.createElement(q(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Y(e)),t}k(e){z(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,s=0;for(const i of e)s===t.length?t.push(r=new X(this.O(I()),this.O(I()),this,this.options)):r=t[s],r._$AI(i),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,i){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=V}_$AI(e,t=this,r,s){const i=this.strings;let a=!1;if(void 0===i)e=Z(this,e,t,0),a=!D(e)||e!==this._$AH&&e!==U,a&&(this._$AH=e);else{const s=e;let o,n;for(e=i[0],o=0;o<i.length-1;o++)n=Z(this,s[r+o],t,o),n===U&&(n=this._$AH[o]),a||=!D(n)||n!==this._$AH[o],n===V?e=V:e!==V&&(e+=(n??"")+i[o+1]),this._$AH[o]=n}a&&!s&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class se extends ee{constructor(e,t,r,s,i){super(e,t,r,s,i),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??V)===U)return;const r=this._$AH,s=e===V&&r!==V||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==V&&(r===V||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(Y,X),(w.litHtmlVersions??=[]).push("3.3.2");const oe=globalThis;class ne extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const s=r?.renderBefore??t;let i=s._$litPart$;if(void 0===i){const e=r?.renderBefore??null;s._$litPart$=i=new X(t.insertBefore(I(),e),e,void 0,r??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}}ne._$litElement$=!0,ne.finalized=!0,oe.litElementHydrateSupport?.({LitElement:ne});const le=oe.litElementPolyfillSupport;le?.({LitElement:ne}),(oe.litElementVersions??=[]).push("4.2.2");const ce=e=>(t,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:v},he=(e=de,t,r)=>{const{kind:s,metadata:i}=r;let a=globalThis.litPropertyMetadata.get(i);if(void 0===a&&globalThis.litPropertyMetadata.set(i,a=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),a.set(r.name,e),"accessor"===s){const{name:s}=r;return{set(r){const i=t.get.call(this);t.set.call(this,r),this.requestUpdate(s,i,e,!0,r)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=r;return function(r){const i=this[s];t.call(this,r),this.requestUpdate(s,i,e,!0,r)}}throw Error("Unsupported decorator location: "+s)};function ge(e){return(t,r)=>"object"==typeof r?he(e,t,r):((e,t,r)=>{const s=t.hasOwnProperty(r);return t.constructor.createProperty(r,e),s?Object.getOwnPropertyDescriptor(t,r):void 0})(e,t,r)}function pe(e){return ge({...e,state:!0,attribute:!1})}const ue="perfectdraft",me=[{value:250,label:"250 mL",description:"Small glass"},{value:330,label:"330 mL",description:"Bottle / standard"},{value:500,label:"500 mL",description:"Half litre"},{value:568,label:"568 mL",description:"Pint (UK)"},{value:473,label:"473 mL",description:"Pint (US)"}],ye=330,fe=[{value:"landscape",label:"Landscape (default)"},{value:"portrait",label:"Portrait (stacked)"},{value:"compact",label:"Compact (single row)"},{value:"hero",label:"Hero (image-forward)"},{value:"vessel",label:"Vessel (single gauge)"}],be="landscape";const Fe=14,ve=7,_e=3,xe=0;function we(e){return`kegs/${e}.webp`}const $e={};const Ae=[{slug:"leffe-blonde",name:"Leffe Blonde",brewery:"Abbaye de Leffe",style:"Belgian Blonde",abv:6.6,colors:{primary:"#C8922A",secondary:"#FFF6E0",text:"#1A0F00"},imagePath:we("leffe-blonde"),kegId:"509"},{slug:"leffe-brune",name:"Leffe Brune",brewery:"Abbaye de Leffe",style:"Belgian Dubbel",abv:6.5,colors:{primary:"#4A2810",secondary:"#F5E6D0",text:"#FFFFFF"},imagePath:we("leffe-brune"),kegId:"2172"},{slug:"leffe-amber",name:"Leffe Ambrée",brewery:"Abbaye de Leffe",style:"Belgian Amber",abv:6.6,colors:{primary:"#B5651D",secondary:"#FFF0D6",text:"#1A0F00"},imagePath:we("leffe-amber")},{slug:"leffe-ruby",name:"Leffe Ruby",brewery:"Abbaye de Leffe",style:"Belgian Fruit Beer",abv:5,colors:{primary:"#8B1A4A",secondary:"#FFE6F0",text:"#FFFFFF"},imagePath:we("leffe-ruby"),kegId:"1095"},{slug:"leffe-blanche",name:"Leffe Blanche",brewery:"Abbaye de Leffe",style:"Belgian Witbier",abv:5,colors:{primary:"#E8DCC8",secondary:"#FFFDF5",text:"#2C2C2C"},imagePath:we("leffe-blanche"),kegId:"44171"},{slug:"leffe-winter",name:"Leffe Winter",brewery:"Abbaye de Leffe",style:"Belgian Winter Ale",abv:6.6,colors:{primary:"#1B3A5C",secondary:"#E0ECF8",text:"#FFFFFF"}},{slug:"leffe-noel",name:"Leffe Noël",brewery:"Abbaye de Leffe",style:"Belgian Winter Ale",abv:6.6,colors:{primary:"#1B3A5C",secondary:"#E0ECF8",text:"#FFFFFF"}},{slug:"leffe-dete",name:"Leffe d'Été",brewery:"Abbaye de Leffe",style:"Belgian Summer Ale",abv:5.2,colors:{primary:"#F5C242",secondary:"#FFFBE6",text:"#1A0F00"},imagePath:we("leffe-dete")},{slug:"leffe-rituel",name:"Leffe Rituel 9°",brewery:"Abbaye de Leffe",style:"Belgian Strong Ale",abv:9,colors:{primary:"#2C1A00",secondary:"#F5E6D0",text:"#C8922A"},imagePath:we("leffe-rituel")},{slug:"leffe-prestige",name:"Leffe Prestige 1240",brewery:"Abbaye de Leffe",style:"Belgian Strong Blonde",abv:8.5,colors:{primary:"#1A3366",secondary:"#E0E8F5",text:"#C8922A"},imagePath:we("leffe-prestige")},{slug:"leffe-0",name:"Leffe Blonde 0.0%",brewery:"Abbaye de Leffe",style:"Non-Alcoholic Blonde",abv:0,colors:{primary:"#C8922A",secondary:"#FFF6E0",text:"#1A0F00"},imagePath:we("leffe-0"),kegId:"48019"},{slug:"hoegaarden",name:"Hoegaarden",brewery:"Brouwerij van Hoegaarden",style:"Belgian Witbier",abv:4.9,colors:{primary:"#F0E4C8",secondary:"#FFFDF2",text:"#2A4B1E"},imagePath:we("hoegaarden"),kegId:"679"},{slug:"hoegaarden-rosee",name:"Hoegaarden Rosée",brewery:"Brouwerij van Hoegaarden",style:"Fruit Witbier",abv:3,colors:{primary:"#E87D9F",secondary:"#FFF0F5",text:"#4A0028"},imagePath:we("hoegaarden-rosee")},{slug:"jupiler",name:"Jupiler",brewery:"AB InBev Belgium",style:"Belgian Pilsner",abv:5.2,colors:{primary:"#D4001A",secondary:"#FFF0F0",text:"#FFFFFF"},imagePath:we("jupiler"),kegId:"458"},{slug:"kwak",name:"Pauwel Kwak",brewery:"Brouwerij Bosteels",style:"Belgian Strong Ale",abv:8.4,colors:{primary:"#B34700",secondary:"#FFF2E5",text:"#FFFFFF"},imagePath:we("kwak")},{slug:"kwak-blonde",name:"Kwak Blonde",brewery:"Brouwerij Bosteels",style:"Belgian Blonde",abv:7.4,colors:{primary:"#D4A547",secondary:"#FFF8E8",text:"#2C1A00"},imagePath:we("kwak-blonde"),kegId:"42640"},{slug:"tripel-karmeliet",name:"Tripel Karmeliet",brewery:"Brouwerij Bosteels",style:"Belgian Tripel",abv:8.4,colors:{primary:"#D4A547",secondary:"#FFF8E8",text:"#2C1A00"},imagePath:we("tripel-karmeliet"),kegId:"31896"},{slug:"gulden-draak",name:"Gulden Draak",brewery:"Brouwerij Van Steenberge",style:"Belgian Strong Dark",abv:10.5,colors:{primary:"#1A1A2E",secondary:"#E8E0F0",text:"#C9A24D"}},{slug:"saint-feuillien",name:"Saint-Feuillien Blonde",brewery:"Brasserie St-Feuillien",style:"Belgian Blonde",abv:7.5,colors:{primary:"#C8922A",secondary:"#FFF6E0",text:"#1A0F00"},imagePath:we("saint-feuillien")},{slug:"dupont",name:"Saison Dupont Dry Hop",brewery:"Brasserie Dupont",style:"Belgian Saison",abv:6.5,colors:{primary:"#8B6914",secondary:"#FFF8E0",text:"#1A0F00"},imagePath:we("dupont"),kegId:"47978"},{slug:"stella-artois",name:"Stella Artois",brewery:"Brouwerij Artois",style:"Belgian Lager",abv:5.2,colors:{primary:"#0E4C1E",secondary:"#F0F8E8",text:"#FFFFFF"},imagePath:we("stella-artois"),kegId:"457"},{slug:"stella-artois-unfiltered",name:"Stella Artois Unfiltered",brewery:"Brouwerij Artois",style:"Unfiltered Lager",abv:5,colors:{primary:"#D4A547",secondary:"#FFFCE8",text:"#0E4C1E"},imagePath:we("stella-artois-unfiltered"),kegId:"43009"},{slug:"stella-artois-0",name:"Stella Artois 0.0%",brewery:"Brouwerij Artois",style:"Non-Alcoholic Lager",abv:0,colors:{primary:"#0E4C1E",secondary:"#F0F8E8",text:"#FFFFFF"},imagePath:we("stella-artois-0"),kegId:"47972"},{slug:"budweiser",name:"Budweiser",brewery:"Anheuser-Busch",style:"American Lager",abv:5,colors:{primary:"#C8102E",secondary:"#FFF0F0",text:"#FFFFFF"},kegId:"31747"},{slug:"bud",name:"Anheuser-Busch Bud",brewery:"Anheuser-Busch",style:"American Lager",abv:5,colors:{primary:"#C8102E",secondary:"#FFF0F0",text:"#FFFFFF"},imagePath:we("bud")},{slug:"bud-light",name:"Bud Light",brewery:"Anheuser-Busch",style:"Light Lager",abv:3.5,colors:{primary:"#004B8D",secondary:"#E8F4FF",text:"#FFFFFF"},imagePath:we("bud-light"),kegId:"42377"},{slug:"corona",name:"Corona Extra",brewery:"Grupo Modelo",style:"Mexican Lager",abv:4.5,colors:{primary:"#FDB913",secondary:"#FFFCE5",text:"#00205B"},imagePath:we("corona"),kegId:"34493"},{slug:"corona-cero",name:"Corona Cero",brewery:"Grupo Modelo",style:"Non-Alcoholic Lager",abv:0,colors:{primary:"#0073B1",secondary:"#E5F3FF",text:"#FFFFFF"},imagePath:we("corona-cero"),kegId:"43235"},{slug:"becks",name:"Beck's",brewery:"Brauerei Beck & Co",style:"German Pilsner",abv:4.8,colors:{primary:"#006838",secondary:"#E0F5E8",text:"#FFFFFF"},imagePath:we("becks"),kegId:"453"},{slug:"becks-gold",name:"Beck's Gold",brewery:"Brauerei Beck & Co",style:"German Lager",abv:4.9,colors:{primary:"#D4A547",secondary:"#FFF8E0",text:"#006838"},imagePath:we("becks-gold"),kegId:"452"},{slug:"peroni",name:"Peroni Nastro Azzurro",brewery:"Birra Peroni",style:"Italian Lager",abv:5.1,colors:{primary:"#003DA5",secondary:"#E8F0FF",text:"#FFFFFF"},imagePath:we("peroni"),kegId:"47384"},{slug:"hertog-jan",name:"Hertog Jan",brewery:"AB InBev Netherlands",style:"Dutch Pilsner",abv:5.1,colors:{primary:"#1A3C0A",secondary:"#E8F0E0",text:"#D4A547"},imagePath:we("hertog-jan"),kegId:"2073"},{slug:"hertog-jan-grand",name:"Hertog Jan Grand Pilsener",brewery:"AB InBev Netherlands",style:"Dutch Pilsner",abv:5.1,colors:{primary:"#1A3C0A",secondary:"#E8F0E0",text:"#D4A547"},imagePath:we("hertog-jan-grand")},{slug:"tennents",name:"Tennent's Lager",brewery:"Wellpark Brewery",style:"Scottish Lager",abv:5,colors:{primary:"#D4001A",secondary:"#FFF0F0",text:"#FFFFFF"},imagePath:we("tennents"),kegId:"36302"},{slug:"la-virgen",name:"La Virgen Lager",brewery:"Cervezas La Virgen",style:"Spanish Lager",abv:5,colors:{primary:"#1E6B3A",secondary:"#E8F5E0",text:"#FFFFFF"},imagePath:we("la-virgen")},{slug:"san-miguel",name:"San Miguel",brewery:"San Miguel",style:"Spanish Lager",abv:5.4,colors:{primary:"#C8102E",secondary:"#FFF0F0",text:"#FFFFFF"},imagePath:we("san-miguel"),kegId:"44059"},{slug:"victoria",name:"Victoria",brewery:"Victoria",style:"Spanish Lager",abv:4.8,colors:{primary:"#1A3C0A",secondary:"#E8F0E0",text:"#D4A547"},imagePath:we("victoria"),kegId:"42223"},{slug:"samson",name:"Samson 11",brewery:"Samson",style:"Czech Lager",abv:4.7,colors:{primary:"#006838",secondary:"#E0F5E8",text:"#FFFFFF"},imagePath:we("samson"),kegId:"47984"},{slug:"franziskaner",name:"Franziskaner Weissbier",brewery:"Spaten-Franziskaner-Bräu",style:"Hefeweizen",abv:5,colors:{primary:"#2E5090",secondary:"#E8F0FF",text:"#F5C242"},imagePath:we("franziskaner"),kegId:"455"},{slug:"franziskaner-royal",name:"Franziskaner Royal",brewery:"Spaten-Franziskaner-Bräu",style:"Weissbier",abv:6,colors:{primary:"#1A1A5C",secondary:"#E0E0F8",text:"#F5C242"},imagePath:we("franziskaner-royal"),kegId:"30955"},{slug:"franziskaner-kellerbier",name:"Franziskaner Kellerbier",brewery:"Spaten-Franziskaner-Bräu",style:"Kellerbier",abv:5.2,colors:{primary:"#6B4423",secondary:"#F5E6D0",text:"#F5C242"},imagePath:we("franziskaner-kellerbier"),kegId:"44452"},{slug:"spaten",name:"Spaten",brewery:"Spaten-Franziskaner-Bräu",style:"Munich Helles",abv:5.2,colors:{primary:"#1A3C0A",secondary:"#E8F0E0",text:"#FFFFFF"},imagePath:we("spaten"),kegId:"29974"},{slug:"lowenbrau",name:"Löwenbräu",brewery:"Löwenbräu",style:"Munich Helles",abv:5.2,colors:{primary:"#003DA5",secondary:"#E8F0FF",text:"#FFFFFF"},imagePath:we("lowenbrau"),kegId:"454"},{slug:"hasseroder",name:"Hasseröder Premium",brewery:"Hasseröder Brauerei",style:"German Pilsner",abv:4.9,colors:{primary:"#006838",secondary:"#E0F5E8",text:"#FFFFFF"},imagePath:we("hasseroder"),kegId:"500"},{slug:"diebels",name:"Diebels Alt",brewery:"Brauerei Diebels",style:"Altbier",abv:4.9,colors:{primary:"#4A2810",secondary:"#F5E6D0",text:"#FFFFFF"},imagePath:we("diebels"),kegId:"456"},{slug:"schneider",name:"Schneider Bayrisch Hell",brewery:"G. Schneider & Sohn",style:"Bavarian Helles",abv:5.2,colors:{primary:"#006838",secondary:"#E8F5E0",text:"#FFFFFF"},imagePath:we("schneider")},{slug:"haake-beck",name:"Haake-Beck",brewery:"Brauerei Beck & Co",style:"German Pilsner",abv:4.9,colors:{primary:"#006838",secondary:"#E0F5E8",text:"#FFFFFF"},imagePath:we("haake-beck"),kegId:"47144"},{slug:"fruh-kolsch",name:"Früh Kölsch",brewery:"Cölner Hofbräu Früh",style:"Kölsch",abv:4.8,colors:{primary:"#C8102E",secondary:"#FFF0F0",text:"#FFFFFF"},imagePath:we("fruh-kolsch"),kegId:"47977"},{slug:"goose-island-ipa",name:"Goose Island IPA",brewery:"Goose Island",style:"India Pale Ale",abv:5.9,colors:{primary:"#D45500",secondary:"#FFF2E5",text:"#FFFFFF"},imagePath:we("goose-island-ipa"),kegId:"32816"},{slug:"goose-island-hazy",name:"Goose Island Hazy Beer Hug",brewery:"Goose Island",style:"Hazy IPA",abv:6.4,colors:{primary:"#F5A623",secondary:"#FFFAE5",text:"#2C1A00"}},{slug:"goose-midway",name:"Goose Midway Session IPA",brewery:"Goose Island",style:"Session IPA",abv:4.1,colors:{primary:"#D45500",secondary:"#FFF2E5",text:"#FFFFFF"},imagePath:we("goose-midway")},{slug:"brewdog-punk-ipa",name:"BrewDog Punk IPA",brewery:"BrewDog",style:"India Pale Ale",abv:5.4,colors:{primary:"#00A3E0",secondary:"#E5F5FF",text:"#FFFFFF"},imagePath:we("brewdog-punk-ipa"),kegId:"41830"},{slug:"brewdog-elvis-juice",name:"BrewDog Elvis Juice",brewery:"BrewDog",style:"Grapefruit IPA",abv:6.5,colors:{primary:"#FF6B1A",secondary:"#FFF3E5",text:"#1A1A1A"},imagePath:we("brewdog-elvis-juice")},{slug:"camden-hells",name:"Camden Hells",brewery:"Camden Town Brewery",style:"Helles Lager",abv:4.6,colors:{primary:"#000000",secondary:"#F5F0E0",text:"#F5C242"},imagePath:we("camden-hells"),kegId:"43006"},{slug:"camden-pale",name:"Camden Pale Ale",brewery:"Camden Town Brewery",style:"Pale Ale",abv:4,colors:{primary:"#E87D00",secondary:"#FFF5E5",text:"#000000"},imagePath:we("camden-pale"),kegId:"43805"},{slug:"camden-ipa",name:"Camden IPA",brewery:"Camden Town Brewery",style:"India Pale Ale",abv:5.8,colors:{primary:"#2E8B57",secondary:"#E5F5EC",text:"#FFFFFF"},imagePath:we("camden-ipa")},{slug:"camden-eazy",name:"Camden Eazy",brewery:"Camden Town Brewery",style:"Session Pale",abv:4,colors:{primary:"#F5C242",secondary:"#FFFCE5",text:"#000000"},imagePath:we("camden-eazy"),kegId:"47629"},{slug:"tiny-rebel-clwb",name:"Tiny Rebel Clwb Tropicana",brewery:"Tiny Rebel",style:"Tropical IPA",abv:5.5,colors:{primary:"#FF3399",secondary:"#FFE5F2",text:"#1A1A1A"},imagePath:we("tiny-rebel-clwb")},{slug:"vocation-life-death",name:"Vocation Life & Death",brewery:"Vocation Brewery",style:"India Pale Ale",abv:6.5,colors:{primary:"#1A1A1A",secondary:"#F0F0F0",text:"#D4001A"},imagePath:we("vocation-life-death"),kegId:"42526"},{slug:"vocation-hop-skip",name:"Vocation Hop, Skip & Juice",brewery:"Vocation Brewery",style:"Pale Ale",abv:5.7,colors:{primary:"#F5A623",secondary:"#FFFAE5",text:"#1A1A1A"},imagePath:we("vocation-hop-skip")},{slug:"thornbridge-jaipur",name:"Thornbridge Jaipur",brewery:"Thornbridge Brewery",style:"India Pale Ale",abv:5.9,colors:{primary:"#8B4513",secondary:"#FFF5EB",text:"#FFFFFF"},imagePath:we("thornbridge-jaipur"),kegId:"34327"},{slug:"ninkasi",name:"Ninkasi IPA",brewery:"Ninkasi Brasserie",style:"India Pale Ale",abv:5.4,colors:{primary:"#D45500",secondary:"#FFF2E5",text:"#FFFFFF"},imagePath:we("ninkasi"),kegId:"47440"},{slug:"fullers-london-pride",name:"Fuller's London Pride",brewery:"Fuller's",style:"English Bitter",abv:4.7,colors:{primary:"#7B241C",secondary:"#F5E6E0",text:"#FFFFFF"},imagePath:we("fullers-london-pride"),kegId:"47943"},{slug:"bass",name:"Bass Pale Ale",brewery:"Bass",style:"English Pale Ale",abv:4.4,colors:{primary:"#E31837",secondary:"#FFF2F2",text:"#FFFFFF"},kegId:"47962"},{slug:"hawkstone",name:"Hawkstone Lager",brewery:"Hawkstone Brewing",style:"English Lager",abv:4.8,colors:{primary:"#3D6B35",secondary:"#E8F0E0",text:"#F5E6C8"},kegId:"43019"},{slug:"old-peculier",name:"Theakston Old Peculier",brewery:"Theakston Brewery",style:"Old Ale",abv:5.6,colors:{primary:"#2C0A1E",secondary:"#F0E0E8",text:"#C8922A"},imagePath:we("old-peculier"),kegId:"47285"},{slug:"adnams",name:"Adnams Ghost Ship",brewery:"Adnams",style:"Pale Ale",abv:4.5,colors:{primary:"#003DA5",secondary:"#E8F0FF",text:"#FFFFFF"}},{slug:"old-speckled-hen",name:"Old Speckled Hen",brewery:"Greene King",style:"English Bitter",abv:5,colors:{primary:"#8B4513",secondary:"#FFF5EB",text:"#FFFFFF"},imagePath:we("old-speckled-hen")},{slug:"northern-monk",name:"Northern Monk A Little Faith",brewery:"Northern Monk",style:"Session Pale",abv:4,colors:{primary:"#1A1A1A",secondary:"#F0F0F0",text:"#F5C242"},imagePath:we("northern-monk"),kegId:"48061"},{slug:"st-austell",name:"St Austell Proper Job IPA",brewery:"St Austell",style:"India Pale Ale",abv:5.5,colors:{primary:"#C8102E",secondary:"#FFF0F0",text:"#FFFFFF"},imagePath:we("st-austell")},{slug:"trooper",name:"Trooper Original",brewery:"Robinsons",style:"English Bitter",abv:4.7,colors:{primary:"#1A1A1A",secondary:"#F0F0F0",text:"#C8102E"},imagePath:we("trooper"),kegId:"47973"},{slug:"castelain",name:"Castelain Grand Cru",brewery:"Brasserie Castelain",style:"Bière de Garde",abv:6.2,colors:{primary:"#8B6914",secondary:"#FFF8E0",text:"#FFFFFF"},imagePath:we("castelain")},{slug:"castelain-chti",name:"Castelain Ch'ti Blonde",brewery:"Brasserie Castelain",style:"Bière de Garde",abv:6.4,colors:{primary:"#D4A547",secondary:"#FFF8E8",text:"#1A0F00"},imagePath:we("castelain-chti"),kegId:"47974"},{slug:"meteor",name:"Meteor White IPA",brewery:"Brasserie Meteor",style:"White IPA",abv:5.6,colors:{primary:"#003DA5",secondary:"#E8F0FF",text:"#FFFFFF"},imagePath:we("meteor"),kegId:"47486"},{slug:"anoesteke",name:"Anosteké Blonde",brewery:"Brasserie du Pays Flamand",style:"French Blonde",abv:8,colors:{primary:"#D4A547",secondary:"#FFF8E8",text:"#1A0F00"},imagePath:we("anoesteke")},{slug:"rousse-mont-blanc",name:"Rousse du Mont Blanc",brewery:"Brasserie du Mont Blanc",style:"French Amber",abv:6.5,colors:{primary:"#B5651D",secondary:"#FFF0D6",text:"#FFFFFF"},imagePath:we("rousse-mont-blanc")},{slug:"modelo",name:"Modelo Especial",brewery:"Grupo Modelo",style:"Mexican Lager",abv:4.5,colors:{primary:"#B8860B",secondary:"#FFF8E8",text:"#1A0F00"},kegId:"47979"},{slug:"mahou",name:"Mahou",brewery:"Mahou",style:"Spanish Lager",abv:4.8,colors:{primary:"#C8102E",secondary:"#FFF0F0",text:"#FFFFFF"},kegId:"44526"},{slug:"la-chouffe",name:"La Chouffe Blonde",brewery:"Brasserie d'Achouffe",style:"Belgian Blonde",abv:8,colors:{primary:"#C0392B",secondary:"#FFF2EE",text:"#FFFFFF"},kegId:"47986"},{slug:"siren-lumina",name:"Siren Lumina IPA",brewery:"Siren Craft Brew",style:"Session IPA",abv:4.2,colors:{primary:"#1F8A8A",secondary:"#E0F5F5",text:"#FFFFFF"},kegId:"48024"},{slug:"singha",name:"Singha",brewery:"Boon Rawd Brewery",style:"Thai Lager",abv:5,colors:{primary:"#8B1A1A",secondary:"#FFF3E0",text:"#E8C86E"},kegId:"47418"},{slug:"thatchers-gold",name:"Thatchers Gold",brewery:"Thatchers",style:"Cider",abv:4.8,colors:{primary:"#D4A017",secondary:"#FFFBEA",text:"#3A2A00"},kegId:"47999"},{slug:"kopparberg-strawberry-lime",name:"Kopparberg Strawberry & Lime",brewery:"Kopparberg",style:"Fruit Cider",abv:4,colors:{primary:"#E4405F",secondary:"#FFF0F3",text:"#FFFFFF"},kegId:"44090"},{slug:"custom",name:"Custom Beer",brewery:"Unknown",style:"Beer",abv:5,colors:{primary:"#555555",secondary:"#F0F0F0",text:"#FFFFFF"}}],Ee=new Map,ke=new Map;for(const e of Ae)Ee.set(e.slug,e),ke.set(e.name.toLowerCase(),e);function Pe(e,t){if(e){const i=(s=e,ke.get(s.toLowerCase()));if(i)return i;const a=(r=e,Ee.get(r));if(a)return a;if(t){const r=t.find(t=>t.name.toLowerCase()===e.toLowerCase());if(r)return{slug:r.name.toLowerCase().replace(/\s+/g,"-"),name:r.name,brewery:r.brewery??"Custom",style:r.style??"Beer",abv:r.abv??5,colors:{primary:r.color_primary??"#555555",secondary:r.color_secondary??"#F0F0F0",text:r.color_text??"#FFFFFF"},imagePath:r.image_url}}return{...Ee.get("custom"),name:e,slug:e.toLowerCase().replace(/\s+/g,"-")}}var r,s;return Ae.filter(e=>"custom"!==e.slug)[0]}let Ce=class extends ne{constructor(){super(...arguments),this._devices=[]}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&this._discoverDevices()}_discoverDevices(){if(!this.hass)return;const e=this.hass.entities||{},t=this.hass.devices||{},r=new Map;for(const[s,i]of Object.entries(e)){if(i.platform!==ue)continue;const e=i.device_id;if(!e)continue;if(!r.has(e)){const s=t[e],i=s?.name_by_user||s?.name||e;r.set(e,{deviceId:e,name:i,entities:new Map})}const a=i.translation_key||i.original_name?.toLowerCase()?.replace(/\s+/g,"_")||s;r.get(e).entities.set(a,s)}this._devices=[...r.values()],1!==this._devices.length||this._config.device_id||this._updateConfig("device_id",this._devices[0].deviceId)}_updateConfig(e,t){this._config={...this._config,[e]:t};const r=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(r)}render(){return this.hass?N`
      <div class="editor">
        <div class="version">PerfectDraft Card Editor v${"0.2.0"} · ${this._devices.length} device(s) found</div>
        ${0===this._devices.length?N`<div class="warning">No PerfectDraft devices found. Please install and configure the PerfectDraft integration first.</div>`:N`
              <div class="field">
                <label>Device</label>
                <select
                  .value=${this._config.device_id??""}
                  @change=${e=>this._updateConfig("device_id",e.target.value)}
                >
                  <option value="" ?selected=${!this._config.device_id}>Select device...</option>
                  ${this._devices.map(e=>N`
                      <option value=${e.deviceId} ?selected=${this._config.device_id===e.deviceId}>
                        ${e.name}
                      </option>
                    `)}
                </select>
              </div>
            `}

        <div class="field">
          <label>Default Glass Size</label>
          <select
            .value=${String(this._config.glass_size??ye)}
            @change=${e=>this._updateConfig("glass_size",parseInt(e.target.value,10))}
          >
            ${me.map(e=>N`
                <option value=${String(e.value)} ?selected=${(this._config.glass_size??ye)===e.value}>
                  ${e.label} — ${e.description}
                </option>
              `)}
          </select>
        </div>

        <div class="field">
          <label>Layout</label>
          <select
            .value=${this._config.layout??be}
            @change=${e=>this._updateConfig("layout",e.target.value)}
          >
            ${fe.map(e=>N`
                <option value=${e.value} ?selected=${(this._config.layout??be)===e.value}>
                  ${e.label}
                </option>
              `)}
          </select>
        </div>

        <div class="advanced-heading">Emoji matrix (advanced)</div>

        <div class="field">
          <label>Matrix columns</label>
          <select
            .value=${this._config.matrix_columns?String(this._config.matrix_columns):"auto"}
            @change=${e=>{const t=e.target.value;this._updateConfig("matrix_columns","auto"===t?void 0:parseInt(t,10))}}
          >
            <option value="auto" ?selected=${!this._config.matrix_columns}>Auto</option>
            ${[3,4,5,6,7,8].map(e=>N`
                <option value=${String(e)} ?selected=${this._config.matrix_columns===e}>${e} columns</option>
              `)}
          </select>
        </div>

        <div class="field">
          <label>Max matrix width (e.g. 480px or 60%)</label>
          <input
            type="text"
            .value=${this._config.max_matrix_width??""}
            placeholder="(unset — fill the zone)"
            @input=${e=>this._updateConfig("max_matrix_width",e.target.value||void 0)}
          />
        </div>
      </div>
    `:N`<div>Loading...</div>`}static get styles(){return o`
      .editor {
        padding: 16px;
      }
      .field {
        margin-bottom: 16px;
      }
      .field label {
        display: block;
        font-weight: 500;
        margin-bottom: 4px;
        font-size: 0.9em;
      }
      .field select,
      .field input {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color, #333);
        border-radius: 4px;
        background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
        color: var(--primary-text-color, #fff);
        font-size: 1em;
        box-sizing: border-box;
      }
      .version {
        font-size: 0.75em;
        opacity: 0.4;
        text-align: right;
        margin-bottom: 12px;
      }
      .advanced-heading {
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.5;
        margin: 4px 0 8px;
        border-top: 1px solid var(--divider-color, #333);
        padding-top: 12px;
      }
      .warning {
        padding: 12px;
        background: rgba(245, 166, 35, 0.15);
        border-radius: 8px;
        color: #f5a623;
        margin-bottom: 16px;
      }
    `}};e([ge({attribute:!1})],Ce.prototype,"hass",void 0),e([pe()],Ce.prototype,"_config",void 0),e([pe()],Ce.prototype,"_devices",void 0),Ce=e([ce("perfectdraft-card-editor")],Ce);function Se(){const e=document.querySelectorAll("script[src]");for(const t of e){const e=t.src;if(e.includes("perfectdraft-card"))return e.substring(0,e.lastIndexOf("/")+1)}return"/hacsfiles/perfectdraft-card/"}function Be(e,t){return`perfectdraft-card:${e}:${t}`}function Ie(e){if(!e||"unavailable"===e||"unknown"===e)return null;const t=parseFloat(e);return isNaN(t)?null:t}let De=class extends ne{constructor(){super(...arguments),this._glassSize=ye,this._layout=be,this._showGlassDialog=!1,this._failedImages=new Set,this._entityIds={},this._openGlassDialog=()=>{this._showGlassDialog=!0}}setConfig(e){if(!e.device_id)throw new Error("PerfectDraft Card: No device configured. Please use the visual editor to select a PerfectDraft device.");var t;this._config={...e},this._layout=(t=e.layout,fe.some(e=>e.value===t)?t:be);const r=e.matrix_columns;this._matrixColumns="number"==typeof r&&Number.isFinite(r)&&r>0?Math.floor(r):void 0,this._maxMatrixWidth="string"==typeof e.max_matrix_width&&e.max_matrix_width.trim()?e.max_matrix_width.trim():void 0;const s=localStorage.getItem(Be(e.device_id,"glass"));this._glassSize=s?parseInt(s,10):e.glass_size??ye}getCardSize(){switch(this._layout){case"compact":return 1;case"vessel":return 4;case"portrait":return 6;default:return 5}}getGridOptions(){switch(this._layout){case"compact":return{rows:1,columns:12,min_columns:2,min_rows:1};case"portrait":return{rows:5,columns:6,min_columns:1,min_rows:3};case"vessel":return{rows:4,columns:6,min_columns:1,min_rows:2};case"hero":return{rows:5,columns:8,min_columns:1,min_rows:2};default:return{columns:4,rows:3,min_columns:1,min_rows:2}}}static getStubConfig(e){const t=e.entities||{},r=new Set;for(const e of Object.values(t))e.platform===ue&&e.device_id&&r.add(e.device_id);return{device_id:1===r.size?[...r][0]:"",glass_size:ye,layout:be}}static getConfigElement(){return document.createElement("perfectdraft-card-editor")}connectedCallback(){super.connectedCallback(),this._resolveEntities()}updated(e){super.updated(e),e.has("hass")&&this._resolveEntities()}_resolveEntities(){if(!this.hass||!this._config?.device_id)return;if(this._entityIds.temperature)return;const e=this.hass.entities||{};for(const[t,r]of Object.entries(e)){if(r.platform!==ue||r.device_id!==this._config.device_id)continue;const e=r.translation_key;"temperature"===e?this._entityIds.temperature=t:"keg_remaining"===e?this._entityIds.kegRemaining=t:"keg_freshness"===e?this._entityIds.kegFreshness=t:"keg_product_id"===e?this._entityIds.kegProduct=t:"keg_name"===e&&(this._entityIds.kegName=t)}}_getState(e){if(e&&this.hass)return this.hass.states[e]?.state}_selectGlass(e){this._glassSize=e,this._showGlassDialog=!1,this._config?.device_id&&localStorage.setItem(Be(this._config.device_id,"glass"),String(e))}_imgError(e){this._failedImages=new Set(this._failedImages).add(e)}render(){if(!this._config||!this.hass)return N`<ha-card><div class="error">Loading...</div></ha-card>`;if(!this._config.device_id)return N`<ha-card><div class="error">No device configured. Please edit this card to select a PerfectDraft device.</div></ha-card>`;const e=this._getState(this._entityIds.kegProduct),t=this._getState(this._entityIds.kegName),r=t&&"unavailable"!==t&&"unknown"!==t?t:void 0;let s;if(e&&/^\d+$/.test(e)&&(s=function(e){if(e)return Ae.find(t=>t.kegId===e)}(e)),!s&&r&&(s=Pe(r,this._config.custom_beers)),s){const e=r??s.name;s.slug===this._beer?.slug&&this._beer?.name===e||(this._beer={...s,name:e})}const i=Ie(this._getState(this._entityIds.temperature)),a=Ie(this._getState(this._entityIds.kegRemaining)),o=Ie(this._getState(this._entityIds.kegFreshness)),n=null===(l=o)?"normal":l<=xe?"expired":l<=_e?"critical":l<=ve?"urgent":l<=Fe?"warning":"normal";var l;const c=null!==a?a/100*6e3:null,d=null!==c?Math.floor(c/this._glassSize):null,h={beer:this._beer??Pe(void 0),temp:i,kegPct:a,freshDays:o,tier:n,glassCount:d},g="portrait"===this._layout?this._renderPortrait(h):"compact"===this._layout?this._renderCompact(h):"hero"===this._layout?this._renderHero(h):"vessel"===this._layout?this._renderVessel(h):this._renderLandscape(h);return N`
      <ha-card class="tier-${n} layout-${this._layout}">
        ${g}
        ${this._showGlassDialog?this._renderGlassDialog():V}
      </ha-card>
    `}_labelStyle(e){return`background: linear-gradient(135deg, ${e.colors.primary}dd, ${e.colors.primary}88);`}_tempText(e){return null!==e?`${Math.round(e)}°C`:"--°C"}_countText(e){return null!==e?`${e} × ${this._glassLabel()}`:`-- × ${this._glassLabel()}`}_renderVisual(e){const t=e.imagePath?e.imagePath.startsWith("http")?e.imagePath:Se()+e.imagePath:void 0;if(t&&!this._failedImages.has(t))return N`<img class="beer-logo" src="${t}" alt="${e.name}" @error=${()=>this._imgError(t)} />`;const r=e.breweryLogo??((s=e.brewery)?$e[s]:void 0);var s;const i=r?r.startsWith("http")?r:Se()+r:void 0;return i&&!this._failedImages.has(i)?N`<img class="beer-logo brewery-logo" src="${i}" alt="${e.name}" @error=${()=>this._imgError(i)} />`:this._renderKegSilhouette(e)}_renderKegSilhouette(e){const t=(e.name.charAt(0)||"?").toUpperCase(),{primary:r,secondary:s}=e.colors;return N`
      <svg class="gen-svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${e.name}">
        <rect x="28" y="12" width="64" height="18" rx="6" fill="${r}" opacity="0.85" />
        <rect x="20" y="26" width="80" height="104" rx="16" fill="${r}" />
        <rect x="20" y="66" width="80" height="40" fill="${s}" />
        <text x="60" y="95" text-anchor="middle" font-size="30" font-weight="700"
              fill="${r}" font-family="system-ui, -apple-system, sans-serif">${t}</text>
        <rect x="28" y="122" width="64" height="18" rx="6" fill="${r}" opacity="0.85" />
      </svg>
    `}_renderGlassVessel(e,t){const r=Math.max(0,Math.min(100,t)),s=128,i=s-112*r/100,a=`pdfill-${e.slug.replace(/[^a-z0-9]/gi,"")}`,o="M24 16 H76 L70 122 Q70 128 64 128 H36 Q30 128 30 122 Z";return N`
      <svg class="vessel-svg" viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="${e.name} ${Math.round(r)}% remaining">
        <defs><clipPath id="${a}"><path d="${o}" /></clipPath></defs>
        <g clip-path="url(#${a})">
          <rect x="22" y="${16}" width="56" height="${112}" fill="${e.colors.secondary}" opacity="0.2" />
          <rect x="22" y="${i}" width="56" height="${s-i}" fill="${e.colors.primary}" />
          ${r>0&&r<100?N`<rect x="22" y="${i-4}" width="56" height="5" fill="#ffffff" opacity="0.85" />`:V}
        </g>
        <path d="${o}" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" />
      </svg>
    `}_renderLabelInner(e,t){return N`
      <div class="beer-logo-area">${this._renderVisual(e)}</div>
      <div class="temperature" style="color: ${e.colors.text};">❄ ${this._tempText(t)}</div>
      <div class="beer-name" style="color: ${e.colors.text};">${e.name}</div>
      <div class="beer-style" style="color: ${e.colors.text}88;">${e.brewery} · ${e.abv}%</div>
    `}_renderKegContent(e){return N`
      ${null!==e.glassCount&&e.glassCount>0?this._renderEmojiGrid(e.glassCount):0===e.glassCount||null!==e.kegPct&&0===e.kegPct?this._renderEmptyKeg():this._renderEmojiGrid(0)}
      <div class="count-label">${this._countText(e.glassCount)}</div>
      ${this._renderFreshnessIndicator(e.freshDays,e.tier)}
    `}_renderLandscape(e){return N`
      <div class="card-content layout-landscape-content">
        <div class="label-zone" style="${this._labelStyle(e.beer)}">
          ${this._renderLabelInner(e.beer,e.temp)}
        </div>
        <div class="keg-zone" @click=${this._openGlassDialog}>${this._renderKegContent(e)}</div>
      </div>
    `}_renderPortrait(e){return N`
      <div class="card-content layout-portrait-content">
        <div class="label-zone label-zone-top" style="${this._labelStyle(e.beer)}">
          ${this._renderLabelInner(e.beer,e.temp)}
        </div>
        <div class="keg-zone" @click=${this._openGlassDialog}>${this._renderKegContent(e)}</div>
      </div>
    `}_renderCompact(e){const t=e.kegPct??0;return N`
      <div class="card-content layout-compact-content">
        <div class="compact-visual">${this._renderVisual(e.beer)}</div>
        <div class="compact-main">
          <div class="compact-name">${e.beer.name}</div>
          <div class="compact-bar">
            <div class="compact-bar-fill" style="width: ${t}%; background: ${e.beer.colors.primary};"></div>
          </div>
        </div>
        <div class="compact-side" @click=${this._openGlassDialog}>
          <div class="compact-temp">❄ ${this._tempText(e.temp)}</div>
          <div class="compact-count">${this._countText(e.glassCount)}</div>
        </div>
      </div>
    `}_renderHero(e){return N`
      <div class="card-content layout-hero-content"
           style="background: radial-gradient(circle at 50% 38%, ${e.beer.colors.primary}33, ${e.beer.colors.primary}0d);">
        <div class="hero-visual">${this._renderVisual(e.beer)}</div>
        <div class="hero-scrim" @click=${this._openGlassDialog}>
          <div class="hero-line">
            <span class="hero-name">${e.beer.name}</span>
            <span class="hero-temp">❄ ${this._tempText(e.temp)}</span>
          </div>
          <div class="hero-count">${this._countText(e.glassCount)}</div>
        </div>
        ${this._renderFreshnessIndicator(e.freshDays,e.tier)}
      </div>
    `}_renderVessel(e){const t=e.kegPct??0;return N`
      <div class="card-content layout-vessel-content">
        <div class="vessel-top">
          <span class="vessel-name">${e.beer.name}</span>
          <span class="vessel-temp">❄ ${this._tempText(e.temp)}</span>
        </div>
        <div class="vessel-mid" @click=${this._openGlassDialog}>${this._renderGlassVessel(e.beer,t)}</div>
        <div class="vessel-count" @click=${this._openGlassDialog}>${this._countText(e.glassCount)}</div>
        ${this._renderFreshnessIndicator(e.freshDays,e.tier)}
      </div>
    `}_renderEmojiGrid(e){const t=Math.floor(6e3/this._glassSize),r=this._matrixColumns&&this._matrixColumns>0?Math.min(this._matrixColumns,t):t<=10?5:6,s=Math.ceil(t/r),i=[];for(let r=0;r<t;r++)i.push(r<e?N`<span class="glass full">🍺</span>`:N`<span class="glass empty">🍺</span>`);const a=this._maxMatrixWidth?`max-width: ${this._maxMatrixWidth}; margin-left: auto; margin-right: auto;`:"";return N`
      <div class="emoji-grid" style="grid-template-columns: repeat(${r}, 1fr); grid-template-rows: repeat(${s}, 1fr); ${a}">
        ${i}
      </div>
    `}_renderEmptyKeg(){return N`
      <div class="empty-keg">
        <div class="empty-icon">🫗</div>
        <div class="empty-title">Keg Empty</div>
        <div class="empty-subtitle">Time to reload!</div>
      </div>
    `}_renderFreshnessIndicator(e,t){if("normal"===t||null===e)return N``;return N`<div class="freshness-indicator freshness-${t}">${{warning:`⏳ ${e}d fresh`,urgent:`⚠ ${e} days left — drink up!`,critical:`🚨 ${e} days left!`,expired:"Keg expired"}[t]??""}</div>`}_glassLabel(){const e=me.find(e=>e.value===this._glassSize);return e?e.label:`${this._glassSize} mL`}_renderGlassDialog(){return N`
      <div class="dialog-overlay" @click=${()=>{this._showGlassDialog=!1}}>
        <div class="dialog" @click=${e=>e.stopPropagation()}>
          <div class="dialog-title">Glass Size</div>
          ${me.map(e=>N`
              <div class="dialog-option ${e.value===this._glassSize?"selected":""}"
                   @click=${()=>this._selectGlass(e.value)}>
                <span class="option-label">${e.label}</span>
                <span class="option-desc">${e.description}</span>
              </div>
            `)}
        </div>
      </div>
    `}static get styles(){return o`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
        overflow: hidden;
        background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
        color: var(--primary-text-color, #fff);
        border: 2px solid transparent;
        transition: border-color 0.5s ease, box-shadow 0.5s ease;
      }

      /* === FRESHNESS TIERS === */
      ha-card.tier-warning {
        border-color: #f5a623;
      }
      ha-card.tier-urgent {
        animation: pulse-orange 2s ease-in-out infinite;
      }
      ha-card.tier-critical {
        animation: pulse-red 1s ease-in-out infinite;
      }
      ha-card.tier-expired {
        border-color: #db4437;
        box-shadow: inset 0 0 30px rgba(219, 68, 55, 0.2);
      }

      @keyframes pulse-orange {
        0%, 100% { border-color: #f5a62366; box-shadow: none; }
        50% { border-color: #f5a623; box-shadow: 0 0 15px #f5a62344; }
      }
      @keyframes pulse-red {
        0%, 100% { border-color: #db443766; box-shadow: none; }
        50% { border-color: #db4437; box-shadow: 0 0 20px #db443744; }
      }

      /* === LAYOUT (landscape default) === */
      .card-content {
        display: flex;
        height: 100%;
        min-height: 300px;
      }

      .label-zone {
        flex: 1 1 25%;
        min-width: 0;
        max-width: 30%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px 20px;
        cursor: pointer;
        user-select: none;
        border-radius: var(--ha-card-border-radius, 12px) 0 0 var(--ha-card-border-radius, 12px);
        transition: filter 0.2s;
      }
      .label-zone:active {
        filter: brightness(0.9);
      }

      .keg-zone {
        flex: 3;
        min-width: 0;
        container-type: inline-size;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px 20px;
        cursor: pointer;
        user-select: none;
        position: relative;
      }
      .keg-zone:active {
        background: rgba(255, 255, 255, 0.03);
      }

      /* === BEER LABEL === */
      .beer-logo-area {
        flex: 1;
        width: 80%;
        max-height: 55%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }
      .beer-logo {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .gen-svg, .vessel-svg {
        width: 100%;
        height: 100%;
        max-height: 100%;
      }
      .beer-logo-text {
        font-size: 5em;
        font-weight: bold;
        opacity: 0.4;
      }
      .temperature {
        font-size: 3em;
        font-weight: 300;
        margin-bottom: 6px;
      }
      .beer-name {
        font-size: 1.6em;
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
      }
      .beer-style {
        font-size: 0.95em;
        margin-top: 4px;
        text-align: center;
      }

      /* === KEG EMOJI GRID === */
      .emoji-grid {
        display: grid;
        justify-items: center;
        align-items: center;
        align-content: stretch;
        width: 100%;
        height: 100%;
        flex: 1;
        padding: 0;
      }
      .glass {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: min(7vw, 4.5em);
        font-size: clamp(0.5em, 14cqi, 4.5em);
      }
      .glass.empty {
        opacity: 0.15;
        filter: grayscale(1);
      }
      .count-label {
        margin-top: 8px;
        font-size: 1.3em;
        opacity: 0.6;
        flex-shrink: 0;
      }

      /* === PORTRAIT === */
      .layout-portrait-content {
        flex-direction: column;
      }
      .layout-portrait-content .label-zone {
        flex: 0 0 auto;
        max-width: none;
        width: 100%;
        padding: 18px 16px;
        border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
      }
      .layout-portrait-content .label-zone .beer-logo-area {
        max-height: 120px;
      }
      .layout-portrait-content .keg-zone {
        flex: 1 1 auto;
        width: 100%;
      }

      /* === COMPACT === */
      .layout-compact-content {
        min-height: 0;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
      }
      .compact-visual {
        flex: 0 0 auto;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .compact-visual .beer-logo,
      .compact-visual .gen-svg {
        max-width: 44px;
        max-height: 44px;
      }
      .compact-main {
        flex: 1 1 auto;
        min-width: 0;
        cursor: pointer;
      }
      .compact-name {
        font-weight: bold;
        font-size: 1.05em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .compact-bar {
        margin-top: 6px;
        height: 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.12);
        overflow: hidden;
      }
      .compact-bar-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.4s ease;
      }
      .compact-side {
        flex: 0 0 auto;
        text-align: right;
        cursor: pointer;
        white-space: nowrap;
      }
      .compact-temp {
        font-size: 1.1em;
        font-weight: 300;
      }
      .compact-count {
        font-size: 0.8em;
        opacity: 0.6;
      }

      /* === HERO === */
      .layout-hero-content {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        min-height: 320px;
        cursor: pointer;
      }
      .hero-visual {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 0;
        padding: 18px 18px 0;
        box-sizing: border-box;
      }
      .hero-visual .beer-logo,
      .hero-visual .gen-svg {
        max-height: 100%;
        max-width: 80%;
        filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
      }
      .hero-scrim {
        width: 100%;
        box-sizing: border-box;
        padding: 28px 20px 16px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent);
        text-align: center;
      }
      .hero-line {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
      }
      .hero-name {
        font-size: 1.5em;
        font-weight: bold;
      }
      .hero-temp {
        font-size: 1.3em;
        font-weight: 300;
      }
      .hero-count {
        font-size: 1.05em;
        opacity: 0.7;
        margin-top: 2px;
      }

      /* === VESSEL === */
      .layout-vessel-content {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 16px;
        min-height: 280px;
      }
      .vessel-top {
        display: flex;
        align-items: baseline;
        gap: 12px;
        cursor: pointer;
        flex-wrap: wrap;
        justify-content: center;
      }
      .vessel-name {
        font-size: 1.4em;
        font-weight: bold;
      }
      .vessel-temp {
        font-size: 1.2em;
        font-weight: 300;
        opacity: 0.85;
      }
      .vessel-mid {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .vessel-count {
        font-size: 1.2em;
        opacity: 0.7;
        cursor: pointer;
      }

      /* === EMPTY KEG === */
      .empty-keg {
        text-align: center;
        opacity: 0.7;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .empty-icon {
        font-size: 6em;
        margin-bottom: 8px;
      }
      .empty-title {
        font-size: 2em;
        font-weight: bold;
        color: #db4437;
      }
      .empty-subtitle {
        font-size: 1.2em;
        opacity: 0.6;
        margin-top: 4px;
      }

      /* === FRESHNESS INDICATOR === */
      .freshness-indicator {
        margin-top: 12px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.9em;
        font-weight: 500;
      }
      .freshness-warning {
        background: rgba(245, 166, 35, 0.15);
        color: #f5a623;
      }
      .freshness-urgent {
        background: rgba(255, 152, 0, 0.2);
        color: #ff9800;
        animation: text-pulse-orange 2s ease-in-out infinite;
      }
      .freshness-critical {
        background: rgba(219, 68, 55, 0.2);
        color: #db4437;
        animation: text-pulse-red 1s ease-in-out infinite;
      }
      .freshness-expired {
        background: rgba(219, 68, 55, 0.3);
        color: #db4437;
        font-weight: bold;
      }

      @keyframes text-pulse-orange {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      @keyframes text-pulse-red {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }

      /* === DIALOGS === */
      .dialog-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .dialog {
        background: var(--ha-card-background, var(--card-background-color, #2c2c2c));
        border-radius: 12px;
        padding: 16px;
        min-width: 260px;
        max-width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }
      .dialog-title {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 12px;
        text-align: center;
      }
      .dialog-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .dialog-option:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .dialog-option.selected {
        background: rgba(255, 255, 255, 0.12);
        font-weight: bold;
      }
      .option-label {
        flex: 1;
      }
      .option-desc {
        font-size: 0.8em;
        opacity: 0.5;
        margin-left: 8px;
      }

      /* === BEER DIALOG === */
      .beer-dialog {
        max-height: 80%;
        display: flex;
        flex-direction: column;
      }
      .beer-search {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        color: inherit;
        font-size: 1em;
        margin-bottom: 8px;
        box-sizing: border-box;
        outline: none;
      }
      .beer-search:focus {
        border-color: rgba(255, 255, 255, 0.3);
      }
      .beer-search::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }
      .beer-list {
        overflow-y: auto;
        max-height: 50vh;
        -webkit-overflow-scrolling: touch;
      }
      .beer-option {
        gap: 8px;
      }
      .beer-color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .custom-heading {
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        opacity: 0.4;
        padding: 12px 12px 4px;
      }

      .error {
        padding: 16px;
        color: var(--error-color, #db4437);
      }
    `}};e([ge({attribute:!1})],De.prototype,"hass",void 0),e([pe()],De.prototype,"_config",void 0),e([pe()],De.prototype,"_beer",void 0),e([pe()],De.prototype,"_glassSize",void 0),e([pe()],De.prototype,"_layout",void 0),e([pe()],De.prototype,"_matrixColumns",void 0),e([pe()],De.prototype,"_maxMatrixWidth",void 0),e([pe()],De.prototype,"_showGlassDialog",void 0),e([pe()],De.prototype,"_failedImages",void 0),De=e([ce("perfectdraft-card")],De),window.customCards=window.customCards||[],window.customCards.push({type:"perfectdraft-card",name:"PerfectDraft Card",description:"Display PerfectDraft Pro keg status with beer emojis",preview:!0,documentationURL:"https://github.com/Falkvinge/hassio-component-perfectdraft-pro"}),console.info("%c PERFECTDRAFT-CARD %c v0.2.0 ","background: #f5a623; color: #000; font-weight: bold;","background: #333; color: #f5a623;");export{De as PerfectDraftCard};
