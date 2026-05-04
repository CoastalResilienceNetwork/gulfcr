import{n as N}from"./glsl-BH37Aalp.js";import{a2 as C,sh as Fe,a3 as Ue,si as Ge,sj as Ee,cP as je,q$ as He,sk as Le,sl as _e,sm as Be,sn as ke,rC as xe,re as qe,a6 as Xe,eB as Ze,so as Ye,sp as Qe,sq as Je,sr as Ke,ss as We,st as et,su as tt,sv as nt,kf as ot,ch as st,cx as ie,cu as j,aG as z,aw as ee,cr as F,cs as V,sw as at,cA as rt,my as lt,aF as B,co as it,a5 as Ae,a4 as ct,cj as Te}from"./index-PHIWLBa9.js";import{t as ut}from"./doublePrecisionUtils-B0owpBza.js";import{s as ft,a as ht,d as dt,o as Ie,b as pt,e as Oe,c as wt,p as mt,w as gt,g as Ot,h as vt,i as xt,n as G,f as E,j as Re,k as Pe}from"./Geometry-BJj1aLAU.js";import{e as x}from"./VertexAttribute-Cq4MnHjR.js";import{r as I,t as Me,n as U}from"./vec3f32-nZdmKIgz.js";import{o as yt,w as Ce}from"./Indices-1I_Q-5rw.js";import{t as S}from"./orientedBoundingBox-j5bpMxLv.js";import{s as te}from"./InterleavedLayout-BpEswnn2.js";function Yt(e){e.code.add(N`const float MAX_RGBA_FLOAT =
255.0 / 256.0 +
255.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 / 256.0;
const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
vec4 float2rgba(const float value) {
float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);
vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);
const float toU8AsFloat = 1.0 / 255.0;
return fixedPointU8 * toU8AsFloat;
}`),e.code.add(N`const vec4 RGBA_TO_FLOAT_FACTORS = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgbaTofloat(vec4 rgba) {
return dot(rgba, RGBA_TO_FLOAT_FACTORS);
}`),e.code.add(N`const vec4 uninterpolatedRGBAToFloatFactors = vec4(
1.0 / 256.0,
1.0 / 256.0 / 256.0,
1.0 / 256.0 / 256.0 / 256.0,
1.0 / 256.0 / 256.0 / 256.0 / 256.0
);
float uninterpolatedRGBAToFloat(vec4 rgba) {
return (dot(round(rgba * 255.0), uninterpolatedRGBAToFloatFactors) - 0.5) * 2.0;
}`)}function Qt(e,n){return e==null&&(e=[]),e.push(n),e}function Jt(e,n){if(e==null)return null;const o=e.filter(t=>t!==n);return o.length===0?null:o}function Kt(e,n,o,t,s){oe[0]=e.get(n,0),oe[1]=e.get(n,1),oe[2]=e.get(n,2),ut(oe,k,3),o.set(s,0,k[0]),t.set(s,0,k[1]),o.set(s,1,k[2]),t.set(s,1,k[3]),o.set(s,2,k[4]),t.set(s,2,k[5])}const oe=C(),k=new Float32Array(6),At=.5;function Wt(e,n){e.include(ft),e.attributes.add(x.POSITION,"vec3"),e.attributes.add(x.NORMAL,"vec3"),e.attributes.add(x.CENTEROFFSETANDDISTANCE,"vec4");const o=e.vertex;ht(o,n),dt(o,n),o.uniforms.add(new Ie("viewport",t=>t.camera.fullViewport),new pt("polygonOffset",t=>t.shaderPolygonOffset),new Oe("cameraGroundRelative",t=>t.camera.aboveGround?1:-1)),n.hasVerticalOffset&&wt(o),o.constants.add("smallOffsetAngle","float",.984807753012208),o.code.add(N`struct ProjectHUDAux {
vec3 posModel;
vec3 posView;
vec3 vnormal;
float distanceToCamera;
float absCosAngle;
};`),o.code.add(N`
    float applyHUDViewDependentPolygonOffset(float pointGroundDistance, float absCosAngle, inout vec3 posView) {
      float pointGroundSign = ${n.terrainDepthTest?N.float(0):N`sign(pointGroundDistance)`};
      if (pointGroundSign == 0.0) {
        pointGroundSign = cameraGroundRelative;
      }

      // cameraGroundRelative is -1 if camera is below ground, 1 if above ground
      // groundRelative is 1 if both camera and symbol are on the same side of the ground, -1 otherwise
      float groundRelative = cameraGroundRelative * pointGroundSign;

      // view angle dependent part of polygon offset emulation: we take the absolute value because the sign that is
      // dropped is instead introduced using the ground-relative position of the symbol and the camera
      if (polygonOffset > .0) {
        float cosAlpha = clamp(absCosAngle, 0.01, 1.0);
        float tanAlpha = sqrt(1.0 - cosAlpha * cosAlpha) / cosAlpha;
        float factor = (1.0 - tanAlpha / viewport[2]);

        // same side of the terrain
        if (groundRelative > 0.0) {
          posView *= factor;
        }
        // opposite sides of the terrain
        else {
          posView /= factor;
        }
      }

      return groundRelative;
    }
  `),n.draped&&!n.hasVerticalOffset||mt(o),n.draped||(o.uniforms.add(new Oe("perDistancePixelRatio",t=>Math.tan(t.camera.fovY/2)/(t.camera.fullViewport[2]/2))),o.code.add(N`
    void applyHUDVerticalGroundOffset(vec3 normalModel, inout vec3 posModel, inout vec3 posView) {
      float distanceToCamera = length(posView);

      // Compute offset in world units for a half pixel shift
      float pixelOffset = distanceToCamera * perDistancePixelRatio * ${N.float(At)};

      // Apply offset along normal in the direction away from the ground surface
      vec3 modelOffset = normalModel * cameraGroundRelative * pixelOffset;

      // Apply the same offset also on the view space position
      vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;

      posModel += modelOffset;
      posView += viewOffset;
    }
  `)),n.screenCenterOffsetUnitsEnabled&&gt(o),n.hasScreenSizePerspective&&Ot(o),o.code.add(N`
    vec4 projectPositionHUD(out ProjectHUDAux aux) {
      vec3 centerOffset = centerOffsetAndDistance.xyz;
      float pointGroundDistance = centerOffsetAndDistance.w;

      aux.posModel = position;
      aux.posView = (view * vec4(aux.posModel, 1.0)).xyz;
      aux.vnormal = normal;
      ${n.draped?"":"applyHUDVerticalGroundOffset(aux.vnormal, aux.posModel, aux.posView);"}

      // Screen sized offset in world space, used for example for line callouts
      // Note: keep this implementation in sync with the CPU implementation, see
      //   - MaterialUtil.verticalOffsetAtDistance
      //   - HUDMaterial.applyVerticalOffsetTransformation

      aux.distanceToCamera = length(aux.posView);

      vec3 viewDirObjSpace = normalize(cameraPosition - aux.posModel);
      float cosAngle = dot(aux.vnormal, viewDirObjSpace);

      aux.absCosAngle = abs(cosAngle);

      ${n.hasScreenSizePerspective&&(n.hasVerticalOffset||n.screenCenterOffsetUnitsEnabled)?"vec3 perspectiveFactor = screenSizePerspectiveScaleFactor(aux.absCosAngle, aux.distanceToCamera, screenSizePerspectiveAlignment);":""}

      ${n.hasVerticalOffset?n.hasScreenSizePerspective?"float verticalOffsetScreenHeight = applyScreenSizePerspectiveScaleFactorFloat(verticalOffset.x, perspectiveFactor);":"float verticalOffsetScreenHeight = verticalOffset.x;":""}

      ${n.hasVerticalOffset?N`
            float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * aux.distanceToCamera, verticalOffset.z, verticalOffset.w);
            vec3 modelOffset = aux.vnormal * worldOffset;
            aux.posModel += modelOffset;
            vec3 viewOffset = (viewNormal * vec4(modelOffset, 1.0)).xyz;
            aux.posView += viewOffset;
            // Since we elevate the object, we need to take that into account
            // in the distance to ground
            pointGroundDistance += worldOffset;`:""}

      float groundRelative = applyHUDViewDependentPolygonOffset(pointGroundDistance, aux.absCosAngle, aux.posView);

      ${n.screenCenterOffsetUnitsEnabled?"":N`
            // Apply x/y in view space, but z in screen space (i.e. along posView direction)
            aux.posView += vec3(centerOffset.x, centerOffset.y, 0.0);

            // Same material all have same z != 0.0 condition so should not lead to
            // branch fragmentation and will save a normalization if it's not needed
            if (centerOffset.z != 0.0) {
              aux.posView -= normalize(aux.posView) * centerOffset.z;
            }
          `}

      vec4 posProj = proj * vec4(aux.posView, 1.0);

      ${n.screenCenterOffsetUnitsEnabled?n.hasScreenSizePerspective?"float centerOffsetY = applyScreenSizePerspectiveScaleFactorFloat(centerOffset.y, perspectiveFactor);":"float centerOffsetY = centerOffset.y;":""}

      ${n.screenCenterOffsetUnitsEnabled?"posProj.xy += vec2(centerOffset.x, centerOffsetY) * pixelRatio * 2.0 / viewport.zw * posProj.w;":""}

      // constant part of polygon offset emulation
      posProj.z -= groundRelative * polygonOffset * posProj.w;
      return posProj;
    }
  `)}function Pt(e){e.uniforms.add(new vt("alignPixelEnabled",n=>n.alignPixelEnabled)),e.code.add(N`vec4 alignToPixelCenter(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.500123) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = (floor(xy * widthHeight) + vec2(0.5)) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`),e.code.add(N`vec4 alignToPixelOrigin(vec4 clipCoord, vec2 widthHeight) {
if (!alignPixelEnabled)
return clipCoord;
vec2 xy = vec2(0.5) + 0.5 * clipCoord.xy / clipCoord.w;
vec2 pixelSz = vec2(1.0) / widthHeight;
vec2 ij = floor((xy + 0.5 * pixelSz) * widthHeight) * pixelSz;
vec2 result = (ij * 2.0 - vec2(1.0)) * clipCoord.w;
return vec4(result, clipCoord.zw);
}`)}var ce;(function(e){e[e.Occluded=0]="Occluded",e[e.NotOccluded=1]="NotOccluded",e[e.Both=2]="Both",e[e.COUNT=3]="COUNT"})(ce||(ce={}));function en(e){e.vertex.uniforms.add(new Oe("renderTransparentlyOccludedHUD",n=>n.hudRenderStyle===ce.Occluded?1:n.hudRenderStyle===ce.NotOccluded?0:.75),new Ie("viewport",n=>n.camera.fullViewport),new xt("hudVisibilityTexture",n=>{var o;return(o=n.hudVisibility)==null?void 0:o.getTexture()})),e.vertex.include(Pt),e.vertex.code.add(N`bool testHUDVisibility(vec4 posProj) {
vec4 posProjCenter = alignToPixelCenter(posProj, viewport.zw);
vec4 occlusionPixel = texture(hudVisibilityTexture, .5 + .5 * posProjCenter.xy / posProjCenter.w);
if (renderTransparentlyOccludedHUD > 0.5) {
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g * renderTransparentlyOccludedHUD < 1.0;
}
return occlusionPixel.r * occlusionPixel.g > 0.0 && occlusionPixel.g == 1.0;
}`)}function tn(e,n){if(e.type==="point")return _(e,n,!1);if(Ge(e))switch(e.type){case"extent":return _(e.center,n,!1);case"polygon":return _(e.centroid,n,!1);case"polyline":return _($e(e),n,!0);case"mesh":return _(Ee(e.vertexSpace,e.spatialReference)??e.extent.center,n,!1);case"multipoint":return}else switch(e.type){case"extent":return _(Mt(e),n,!0);case"polygon":return _($t(e),n,!0);case"polyline":return _($e(e),n,!0);case"multipoint":return}}function $e(e){const n=e.paths[0];if(!n||n.length===0)return null;const o=Be(n,ke(n)/2);return xe(o[0],o[1],o[2],e.spatialReference)}function Mt(e){return xe(.5*(e.xmax+e.xmin),.5*(e.ymax+e.ymin),e.zmin!=null&&e.zmax!=null&&isFinite(e.zmin)&&isFinite(e.zmax)?.5*(e.zmax+e.zmin):void 0,e.spatialReference)}function $t(e){const n=e.rings[0];if(!n||n.length===0)return null;const o=qe(e.rings,!!e.hasZ);return xe(o[0],o[1],o[2],e.spatialReference)}function _(e,n,o){const t=o?e:Le(e);return n&&e?_e(e,t,n)?t:null:t}function nn(e,n,o,t=0){if(e){n||(n=je());const s=e;let f=.5*s.width*(o-1),a=.5*s.height*(o-1);return s.width<1e-7*s.height?f+=a/20:s.height<1e-7*s.width&&(a+=f/20),He(n,s.xmin-f-t,s.ymin-a-t,s.xmax+f+t,s.ymax+a+t),n}return null}function on(e,n,o=null){const t=Ke(We);return e!=null&&(t[0]=e[0],t[1]=e[1],t[2]=e[2]),n!=null?t[3]=n:e!=null&&e.length>3&&(t[3]=e[3]),o&&(t[0]*=o,t[1]*=o,t[2]*=o,t[3]*=o),t}function sn(e=Fe,n,o,t=1){const s=new Array(3);if(n==null||o==null)s[0]=1,s[1]=1,s[2]=1;else{let f,a=0;for(let l=2;l>=0;l--){const c=e[l],r=c!=null,i=l===0&&!f&&!r,d=o[l];let y;c==="symbol-value"||i?y=d!==0?n[l]/d:1:r&&c!=="proportional"&&isFinite(c)&&(y=d!==0?c/d:1),y!=null&&(s[l]=y,f=y,a=Math.max(a,Math.abs(y)))}for(let l=2;l>=0;l--)s[l]==null?s[l]=f:s[l]===0&&(s[l]=.001*a)}for(let f=2;f>=0;f--)s[f]/=t;return Ue(s)}function St(e){return e.isPrimitive!=null}function an(e){return bt(St(e)?[e.width,e.depth,e.height]:e)?null:"Symbol sizes may not be negative values"}function bt(e){const n=o=>o==null||o>=0;return Array.isArray(e)?e.every(n):n(e)}function rn(e,n,o,t=Xe()){return e&&et(t,t,-e/180*Math.PI),n&&tt(t,t,n/180*Math.PI),o&&nt(t,t,o/180*Math.PI),t}function ln(e,n,o){if(o.minDemResolution!=null)return o.minDemResolution;const t=Ze(n),s=Ye(e)*t,f=Qe(e)*t,a=Je(e)*(n.isGeographic?1:t);return s===0&&f===0&&a===0?o.minDemResolutionForPoints:.01*Math.max(s,f,a)}var ve;(function(e){function n(a,l){const c=a[l],r=a[l+1],i=a[l+2];return Math.sqrt(c*c+r*r+i*i)}function o(a,l){const c=a[l],r=a[l+1],i=a[l+2],d=1/Math.sqrt(c*c+r*r+i*i);a[l]*=d,a[l+1]*=d,a[l+2]*=d}function t(a,l,c){a[l]*=c,a[l+1]*=c,a[l+2]*=c}function s(a,l,c,r,i,d=l){(i=i||a)[d]=a[l]+c[r],i[d+1]=a[l+1]+c[r+1],i[d+2]=a[l+2]+c[r+2]}function f(a,l,c,r,i,d=l){(i=i||a)[d]=a[l]-c[r],i[d+1]=a[l+1]-c[r+1],i[d+2]=a[l+2]-c[r+2]}e.length=n,e.normalize=o,e.scale=t,e.add=s,e.subtract=f})(ve||(ve={}));const X=ve,pe=[[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5]],Tt=[0,0,1,-1,0,0,1,0,0,0,-1,0,0,1,0,0,0,-1],It=[0,0,1,0,1,1,0,1],Rt=[0,1,2,2,3,0,4,0,3,3,7,4,1,5,6,6,2,1,1,0,4,4,5,1,3,2,6,6,7,3,5,4,7,7,6,5],Ne=new Array(36);for(let e=0;e<6;e++)for(let n=0;n<6;n++)Ne[6*e+n]=e;const q=new Array(36);for(let e=0;e<6;e++)q[6*e]=0,q[6*e+1]=1,q[6*e+2]=2,q[6*e+3]=2,q[6*e+4]=3,q[6*e+5]=0;function cn(e,n){Array.isArray(n)||(n=[n,n,n]);const o=new Array(24);for(let t=0;t<8;t++)o[3*t]=pe[t][0]*n[0],o[3*t+1]=pe[t][1]*n[1],o[3*t+2]=pe[t][2]*n[2];return new E(e,[[x.POSITION,new S(o,Rt,3,!0)],[x.NORMAL,new S(Tt,Ne,3)],[x.UV0,new S(It,q,2)]])}const we=[[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5],[0,-.5,0],[0,.5,0]],Ct=[0,1,-1,1,1,0,0,1,1,-1,1,0,0,-1,-1,1,-1,0,0,-1,1,-1,-1,0],Nt=[5,1,0,5,2,1,5,3,2,5,0,3,4,0,1,4,1,2,4,2,3,4,3,0],zt=[0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7];function un(e,n){Array.isArray(n)||(n=[n,n,n]);const o=new Array(18);for(let t=0;t<6;t++)o[3*t]=we[t][0]*n[0],o[3*t+1]=we[t][1]*n[1],o[3*t+2]=we[t][2]*n[2];return new E(e,[[x.POSITION,new S(o,Nt,3,!0)],[x.NORMAL,new S(Ct,zt,3)]])}const se=I(-.5,0,-.5),ae=I(.5,0,-.5),re=I(0,0,.5),le=I(0,.5,0),Z=U(),Y=U(),J=U(),K=U(),W=U();j(Z,se,le),j(Y,se,ae),B(J,Z,Y),z(J,J),j(Z,ae,le),j(Y,ae,re),B(K,Z,Y),z(K,K),j(Z,re,le),j(Y,re,se),B(W,Z,Y),z(W,W);const me=[se,ae,re,le],Dt=[0,-1,0,J[0],J[1],J[2],K[0],K[1],K[2],W[0],W[1],W[2]],Vt=[0,1,2,3,1,0,3,2,1,3,0,2],Ft=[0,0,0,1,1,1,2,2,2,3,3,3];function fn(e,n){Array.isArray(n)||(n=[n,n,n]);const o=new Array(12);for(let t=0;t<4;t++)o[3*t]=me[t][0]*n[0],o[3*t+1]=me[t][1]*n[1],o[3*t+2]=me[t][2]*n[2];return new E(e,[[x.POSITION,new S(o,Vt,3,!0)],[x.NORMAL,new S(Dt,Ft,3)]])}function hn(e,n,o,t,s={uv:!0}){const f=-Math.PI,a=2*Math.PI,l=-Math.PI/2,c=Math.PI,r=Math.max(3,Math.floor(o)),i=Math.max(2,Math.floor(t)),d=(r+1)*(i+1),y=G(3*d),P=G(3*d),A=G(2*d),g=[];let h=0;for(let m=0;m<=i;m++){const T=[],u=m/i,M=l+u*c,$=Math.cos(M);for(let R=0;R<=r;R++){const H=R/r,O=f+H*a,D=Math.cos(O)*$,b=Math.sin(M),ne=-Math.sin(O)*$;y[3*h]=D*n,y[3*h+1]=b*n,y[3*h+2]=ne*n,P[3*h]=D,P[3*h+1]=b,P[3*h+2]=ne,A[2*h]=H,A[2*h+1]=u,T.push(h),++h}g.push(T)}const w=new Array;for(let m=0;m<i;m++)for(let T=0;T<r;T++){const u=g[m][T],M=g[m][T+1],$=g[m+1][T+1],R=g[m+1][T];m===0?(w.push(u),w.push($),w.push(R)):m===i-1?(w.push(u),w.push(M),w.push($)):(w.push(u),w.push(M),w.push($),w.push($),w.push(R),w.push(u))}const p=[[x.POSITION,new S(y,w,3,!0)],[x.NORMAL,new S(P,w,3,!0)]];return s.uv&&p.push([x.UV0,new S(A,w,2,!0)]),s.offset&&(p[0][0]=x.OFFSET,p.push([x.POSITION,new S(Float64Array.from(s.offset),Ce(w.length),3,!0)])),new E(e,p)}function dn(e,n,o,t){const s=Ut(n,o);return new E(e,s)}function Ut(e,n,o){let t,s;t=[0,-1,0,1,0,0,0,0,1,-1,0,0,0,0,-1,0,1,0],s=[0,1,2,0,2,3,0,3,4,0,4,1,1,5,2,2,5,3,3,5,4,4,5,1];for(let c=0;c<t.length;c+=3)X.scale(t,c,e/X.length(t,c));let f={};function a(c,r){c>r&&([c,r]=[r,c]);const i=c.toString()+"."+r.toString();if(f[i])return f[i];let d=t.length;return t.length+=3,X.add(t,3*c,t,3*r,t,d),X.scale(t,d,e/X.length(t,d)),d/=3,f[i]=d,d}for(let c=0;c<n;c++){const r=s.length,i=new Array(4*r);for(let d=0;d<r;d+=3){const y=s[d],P=s[d+1],A=s[d+2],g=a(y,P),h=a(P,A),w=a(A,y),p=4*d;i[p]=y,i[p+1]=g,i[p+2]=w,i[p+3]=P,i[p+4]=h,i[p+5]=g,i[p+6]=A,i[p+7]=w,i[p+8]=h,i[p+9]=g,i[p+10]=h,i[p+11]=w}s=i,f={}}const l=Pe(t);for(let c=0;c<l.length;c+=3)X.normalize(l,c);return[[x.POSITION,new S(Pe(t),s,3,!0)],[x.NORMAL,new S(l,s,3,!0)]]}function pn(e,n={}){const{normal:o,position:t,color:s,rotation:f,size:a,centerOffsetAndDistance:l,uvs:c,featureAttribute:r,objectAndLayerIdColor:i=null}=n,d=t?Ae(t):C(),y=o?Ae(o):ct(0,0,1),P=s?[255*s[0],255*s[1],255*s[2],s.length>3?255*s[3]:255]:[255,255,255,255],A=a!=null&&a.length===2?a:[1,1],g=f!=null?[f]:[0],h=Ce(1),w=[[x.POSITION,new S(d,h,3,!0)],[x.NORMAL,new S(y,h,3,!0)],[x.COLOR,new S(P,h,4,!0)],[x.SIZE,new S(A,h,2)],[x.ROTATION,new S(g,h,1,!0)]];if(c&&w.push([x.UV0,new S(c,h,c.length)]),l!=null){const p=[l[0],l[1],l[2],l[3]];w.push([x.CENTEROFFSETANDDISTANCE,new S(p,h,4)])}if(r){const p=[r[0],r[1],r[2],r[3]];w.push([x.FEATUREATTRIBUTE,new S(p,h,4)])}return new E(e,w,null,Re.Point,i)}function Gt(e,n,o,t,s=!0,f=!0){let a=0;const l=n,c=e;let r=I(0,a,0),i=I(0,a+c,0),d=I(0,-1,0),y=I(0,1,0);t&&(a=c,i=I(0,0,0),r=I(0,a,0),d=I(0,1,0),y=I(0,-1,0));const P=[i,r],A=[d,y],g=o+2,h=Math.sqrt(c*c+l*l);if(t)for(let u=o-1;u>=0;u--){const M=u*(2*Math.PI/o),$=I(Math.cos(M)*l,a,Math.sin(M)*l);P.push($);const R=I(c*Math.cos(M)/h,-l/h,c*Math.sin(M)/h);A.push(R)}else for(let u=0;u<o;u++){const M=u*(2*Math.PI/o),$=I(Math.cos(M)*l,a,Math.sin(M)*l);P.push($);const R=I(c*Math.cos(M)/h,l/h,c*Math.sin(M)/h);A.push(R)}const w=new Array,p=new Array;if(s){for(let u=3;u<P.length;u++)w.push(1),w.push(u-1),w.push(u),p.push(0),p.push(0),p.push(0);w.push(P.length-1),w.push(2),w.push(1),p.push(0),p.push(0),p.push(0)}if(f){for(let u=3;u<P.length;u++)w.push(u),w.push(u-1),w.push(0),p.push(u),p.push(u-1),p.push(1);w.push(0),w.push(2),w.push(P.length-1),p.push(1),p.push(2),p.push(A.length-1)}const m=G(3*g);for(let u=0;u<g;u++)m[3*u]=P[u][0],m[3*u+1]=P[u][1],m[3*u+2]=P[u][2];const T=G(3*g);for(let u=0;u<g;u++)T[3*u]=A[u][0],T[3*u+1]=A[u][1],T[3*u+2]=A[u][2];return[[x.POSITION,new S(m,w,3,!0)],[x.NORMAL,new S(T,p,3,!0)]]}function wn(e,n,o,t,s,f=!0,a=!0){return new E(e,Gt(n,o,t,s,f,a))}function mn(e,n,o,t,s,f,a){const l=s?Me(s):I(1,0,0),c=f?Me(f):I(0,0,0);a??(a=!0);const r=U();z(r,l);const i=U();F(i,r,Math.abs(n));const d=U();F(d,i,-.5),V(d,d,c);const y=I(0,1,0);Math.abs(1-Te(r,y))<.2&&ie(y,0,0,1);const P=U();B(P,r,y),z(P,P),B(y,P,r);const A=2*t+(a?2:0),g=t+(a?2:0),h=G(3*A),w=G(3*g),p=G(2*A),m=new Array(3*t*(a?4:2)),T=new Array(3*t*(a?4:2));a&&(h[3*(A-2)]=d[0],h[3*(A-2)+1]=d[1],h[3*(A-2)+2]=d[2],p[2*(A-2)]=0,p[2*(A-2)+1]=0,h[3*(A-1)]=h[3*(A-2)]+i[0],h[3*(A-1)+1]=h[3*(A-2)+1]+i[1],h[3*(A-1)+2]=h[3*(A-2)+2]+i[2],p[2*(A-1)]=1,p[2*(A-1)+1]=1,w[3*(g-2)]=-r[0],w[3*(g-2)+1]=-r[1],w[3*(g-2)+2]=-r[2],w[3*(g-1)]=r[0],w[3*(g-1)+1]=r[1],w[3*(g-1)+2]=r[2]);const u=(O,D,b)=>{m[O]=D,T[O]=b};let M=0;const $=U(),R=U();for(let O=0;O<t;O++){const D=O*(2*Math.PI/t);F($,y,Math.sin(D)),F(R,P,Math.cos(D)),V($,$,R),w[3*O]=$[0],w[3*O+1]=$[1],w[3*O+2]=$[2],F($,$,o),V($,$,d),h[3*O]=$[0],h[3*O+1]=$[1],h[3*O+2]=$[2],p[2*O]=O/t,p[2*O+1]=0,h[3*(O+t)]=h[3*O]+i[0],h[3*(O+t)+1]=h[3*O+1]+i[1],h[3*(O+t)+2]=h[3*O+2]+i[2],p[2*(O+t)]=O/t,p[2*O+1]=1;const b=(O+1)%t;u(M++,O,O),u(M++,O+t,O),u(M++,b,b),u(M++,b,b),u(M++,O+t,O),u(M++,b+t,b)}if(a){for(let O=0;O<t;O++){const D=(O+1)%t;u(M++,A-2,g-2),u(M++,O,g-2),u(M++,D,g-2)}for(let O=0;O<t;O++){const D=(O+1)%t;u(M++,O+t,g-1),u(M++,A-1,g-1),u(M++,D+t,g-1)}}const H=[[x.POSITION,new S(h,m,3,!0)],[x.NORMAL,new S(w,T,3,!0)],[x.UV0,new S(p,m,2,!0)]];return new E(e,H)}function gn(e,n,o,t,s,f){t=t||10,s=s==null||s,te(n.length>1);const a=[[0,0,0]],l=[],c=[];for(let r=0;r<t;r++){l.push([0,-r-1,-(r+1)%t-1]);const i=r/t*2*Math.PI;c.push([Math.cos(i)*o,Math.sin(i)*o])}return Et(e,c,n,a,l,s,f)}function Et(e,n,o,t,s,f,a=I(0,0,0)){const l=n.length,c=G(o.length*l*3+(6*t.length||0)),r=G(o.length*l*3+(t?6:0)),i=new Array,d=new Array;let y=0,P=0;const A=C(),g=C(),h=C(),w=C(),p=C(),m=C(),T=C(),u=C(),M=C(),$=C(),R=C(),H=C(),O=C(),D=st();ie(M,0,1,0),j(g,o[1],o[0]),z(g,g),f?(V(u,o[0],a),z(h,u)):ie(h,0,0,1),Se(g,h,M,M,p,h,be),ee(w,h),ee(H,p);for(let v=0;v<t.length;v++)F(m,p,t[v][0]),F(u,h,t[v][2]),V(m,m,u),V(m,m,o[0]),c[y++]=m[0],c[y++]=m[1],c[y++]=m[2];r[P++]=-g[0],r[P++]=-g[1],r[P++]=-g[2];for(let v=0;v<s.length;v++)i.push(s[v][0]>0?s[v][0]:-s[v][0]-1+t.length),i.push(s[v][1]>0?s[v][1]:-s[v][1]-1+t.length),i.push(s[v][2]>0?s[v][2]:-s[v][2]-1+t.length),d.push(0),d.push(0),d.push(0);let b=t.length;const ne=t.length-1;for(let v=0;v<o.length;v++){let ye=!1;v>0&&(ee(A,g),v<o.length-1?(j(g,o[v+1],o[v]),z(g,g)):ye=!0,V($,A,g),z($,$),V(R,o[v-1],w),at(o[v],$,D),rt(D,lt(R,A),u)?(j(u,u,o[v]),z(h,u),B(p,$,h),z(p,p)):Se($,w,H,M,p,h,be),ee(w,h),ee(H,p)),f&&(V(u,o[v],a),z(O,u));for(let L=0;L<l;L++)if(F(m,p,n[L][0]),F(u,h,n[L][1]),V(m,m,u),z(T,m),r[P++]=T[0],r[P++]=T[1],r[P++]=T[2],V(m,m,o[v]),c[y++]=m[0],c[y++]=m[1],c[y++]=m[2],!ye){const he=(L+1)%l;i.push(b+L),i.push(b+l+L),i.push(b+he),i.push(b+he),i.push(b+l+L),i.push(b+l+he);for(let de=0;de<6;de++){const Ve=i.length-6;d.push(i[Ve+de]-ne)}}b+=l}const ze=o[o.length-1];for(let v=0;v<t.length;v++)F(m,p,t[v][0]),F(u,h,t[v][1]),V(m,m,u),V(m,m,ze),c[y++]=m[0],c[y++]=m[1],c[y++]=m[2];const ue=P/3;r[P++]=g[0],r[P++]=g[1],r[P++]=g[2];const fe=b-l;for(let v=0;v<s.length;v++)i.push(s[v][0]>=0?b+s[v][0]:-s[v][0]-1+fe),i.push(s[v][2]>=0?b+s[v][2]:-s[v][2]-1+fe),i.push(s[v][1]>=0?b+s[v][1]:-s[v][1]-1+fe),d.push(ue),d.push(ue),d.push(ue);const De=[[x.POSITION,new S(c,i,3,!0)],[x.NORMAL,new S(r,d,3,!0)]];return new E(e,De)}function On(e,n,o,t){te(n.length>1,"createPolylineGeometry(): polyline needs at least 2 points"),te(n[0].length===3,"createPolylineGeometry(): malformed vertex"),te(o==null||o.length===n.length,"createPolylineGeometry: need same number of points and normals"),te(o==null||o[0].length===3,"createPolylineGeometry(): malformed normal");const s=ot(3*n.length),f=new Array(2*(n.length-1));let a=0,l=0;for(let r=0;r<n.length;r++){for(let i=0;i<3;i++)s[a++]=n[r][i];r>0&&(f[l++]=r-1,f[l++]=r)}const c=[[x.POSITION,new S(s,f,3,!0)]];if(o){const r=G(3*o.length);let i=0;for(let d=0;d<n.length;d++)for(let y=0;y<3;y++)r[i++]=o[d][y];c.push([x.NORMAL,new S(r,f,3,!0)])}return t&&c.push([x.COLOR,new S(t,yt(t.length/4),4)]),new E(e,c,null,Re.Line)}function vn(e,n,o,t,s,f=0){const a=new Array(18),l=[[-o,f,s/2],[t,f,s/2],[0,n+f,s/2],[-o,f,-s/2],[t,f,-s/2],[0,n+f,-s/2]],c=[0,1,2,3,0,2,2,5,3,1,4,5,5,2,1,1,0,3,3,4,1,4,3,5];for(let r=0;r<6;r++)a[3*r]=l[r][0],a[3*r+1]=l[r][1],a[3*r+2]=l[r][2];return new E(e,[[x.POSITION,new S(a,c,3,!0)]])}function xn(e,n){const o=e.getMutableAttribute(x.POSITION).data;for(let t=0;t<o.length;t+=3){const s=o[t],f=o[t+1],a=o[t+2];ie(Q,s,f,a),it(Q,Q,n),o[t]=Q[0],o[t+1]=Q[1],o[t+2]=Q[2]}}function yn(e,n=e){const o=e.attributes,t=o.get(x.POSITION).data,s=o.get(x.NORMAL).data;if(s){const f=n.getMutableAttribute(x.NORMAL).data;for(let a=0;a<s.length;a+=3){const l=s[a+1];f[a+1]=-s[a+2],f[a+2]=l}}if(t){const f=n.getMutableAttribute(x.POSITION).data;for(let a=0;a<t.length;a+=3){const l=t[a+1];f[a+1]=-t[a+2],f[a+2]=l}}}function ge(e,n,o,t,s){return!(Math.abs(Te(n,e))>s)&&(B(o,e,n),z(o,o),B(t,o,e),z(t,t),!0)}function Se(e,n,o,t,s,f,a){return ge(e,n,s,f,a)||ge(e,o,s,f,a)||ge(e,t,s,f,a)}const be=.99619469809,Q=C();function An(e){return e.type==="point"}export{on as A,un as B,sn as D,ln as E,cn as F,Se as M,xn as O,nn as S,an as U,bt as Z,ce as a,Yt as b,Gt as c,Pt as d,en as e,At as f,fn as g,mn as h,wn as i,tn as j,pn as k,Kt as l,yn as m,Qt as n,rn as o,hn as p,vn as q,Jt as r,dn as s,An as t,Wt as u,gn as v,On as w,Et as x};
