"""Blender 4.5: refine the NASA MER mesh into an editable teaching reconstruction.
Run: blender --background --factory-startup --python scripts/build-spirit.py
Reference proportions: NASA source; authored detail: supplied MER render references.
All detail is explicit mesh/PBR material, so it survives glTF export.
"""
import bpy, math, json
from mathutils.bvhtree import BVHTree
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets'/'blender'
OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/mer-rover.glb'))
source=[o for o in bpy.context.scene.objects if o.type=='MESH']
for o in source:
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active=o
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='MATERIAL'); bpy.ops.object.mode_set(mode='OBJECT')
for o in list(bpy.context.scene.objects):
    if o.type!='MESH': continue
    name=o.data.materials[0].name
    if any(n in name for n in ['suspension','tex_mast','tex_arm']): bpy.data.objects.remove(o,do_unlink=True); continue
    part='power' if 'panels' in name else 'instruments' if any(n in name for n in ['instruments','foil_silver','Silver']) else 'body'
    o.name=part+'_NASA_'+name; o['assembly']=part
    for mat in o.data.materials:
        bs=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
        if bs:
            bs.inputs['Metallic'].default_value=.5 if part=='power' else .65
            bs.inputs['Roughness'].default_value=.38 if part=='power' else .48

def mat(name,color,metal=.0,rough=.4):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough
    return m
silver=mat('Brushed aluminium',(.55,.58,.59),.8,.29)
white=mat('Warm ceramic insulation',(.78,.75,.66),.15,.43)
gold=mat('Copper gold harness',(.40,.22,.068),.72,.32)
dark=mat('Dust coated metal wheels',(.075,.064,.053),.5,.65)
tread=mat('Burnished wheel ribs',(.14,.115,.085),.6,.5)
black=mat('Carbon and optical baffles',(.016,.02,.023),.15,.36)
blue=mat('Cable retention collars',(.037,.12,.26),.25,.4)
glass=mat('Camera optics',(.015,.042,.058),.65,.14)
cells=[mat('Silicon cells '+str(i),(.028+i*.003,.074+i*.004,.115+i*.005),.48,.32) for i in range(4)]

# Work in the application's Y-up coordinate system; Blender uses Z-up.
def pt(p):return Vector((p[0],-p[2],p[1]))
def finish(o,name,part,m):
    o.name=part+'_'+name;o['assembly']=part;o.data.materials.append(m)
    return o
def box(name,part,p,size,m,bevel=.002):
    if not bevel:
        corners=[(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]
        mesh=bpy.data.meshes.new(name);mesh.from_pydata([pt(tuple(p[j]+c[j]*size[j]/2 for j in range(3))) for c in corners],[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);mesh.update()
        o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o)
        return finish(o,name,part,m)
    bpy.ops.mesh.primitive_cube_add(size=1,location=pt(p));o=bpy.context.object;o.scale=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        mod=o.modifiers.new('Manufactured edges','BEVEL');mod.width=bevel;mod.segments=2;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
    return finish(o,name,part,m)
def rod(name,part,a,b,r,m,verts=16,r2=None):
    av,bv=pt(a),pt(b);d=bv-av
    bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r,radius2=r if r2 is None else r2,depth=d.length,location=(av+bv)/2)
    o=bpy.context.object;o.rotation_mode='QUATERNION';o.rotation_quaternion=d.to_track_quat('Z','Y')
    for p in o.data.polygons:p.use_smooth=len(p.vertices)==4
    return finish(o,name,part,m)
def cable(name,part,points,r=.002,m=gold):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=2;c.resolution_u=10
    s=c.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
    for b,p in zip(s.bezier_points,points):b.co=pt(p);b.handle_left_type='AUTO';b.handle_right_type='AUTO'
    o=bpy.data.objects.new(part+'_'+name,c);bpy.context.collection.objects.link(o);o['assembly']=part;c.materials.append(m)
    return o
def ring(name,part,p,r,t,m,axis='x'):
    bpy.ops.mesh.primitive_torus_add(major_segments=40,minor_segments=6,location=pt(p),major_radius=r,minor_radius=t)
    o=bpy.context.object
    if axis=='x':o.rotation_euler[1]=math.pi/2
    elif axis=='z':o.rotation_euler[0]=math.pi/2
    for poly in o.data.polygons:poly.use_smooth=True
    return finish(o,name,part,m)

# Six wheels: metal skins, raised grousers, dished rims, hub rings and bolts.
for side in [-1,1]:
    x=side*.535
    for z in [-.58,0,.58]:
        y=.136
        rod('wheel drum','mobility',(x-.058,y,z),(x+.058,y,z),.133,dark,48)
        for a in range(28):
            t=a*math.tau/28
            rod('raised wheel grouser','mobility',(x-.061,y+.133*math.sin(t),z+.133*math.cos(t)),(x+.061,y+.133*math.sin(t),z+.133*math.cos(t)),.0035,tread,6)
        for edge in [-1,1]:
            ex=x+edge*.059
            ring('rolled wheel lip','mobility',(ex,y,z),.128,.004,silver)
            rod('dished wheel face','mobility',(ex-edge*.009,y,z),(ex,y,z),.109,silver,40,r2=.074)
            ring('copper rim','mobility',(ex,y,z),.104,.003,gold)
            rod('wheel hub','mobility',(ex,y,z),(ex+edge*.012,y,z),.038,silver,24)
            for i in range(8):
                a=i*math.tau/8
                rod('hub recess','mobility',(ex+edge*.001,y+.075*math.sin(a),z+.075*math.cos(a)),(ex+edge*.002,y+.075*math.sin(a),z+.075*math.cos(a)),.010,black,10)
                rod('hub fastener','mobility',(ex+edge*.01,y+.03*math.sin(a),z+.03*math.cos(a)),(ex+edge*.014,y+.03*math.sin(a),z+.03*math.cos(a)),.003,silver,6)
        rod('wheel spindle','mobility',(side*.43,y,z),(x,y,z),.023,silver,20)
    # Recognizable rocker-bogie linkage; static teaching pose, not simulated suspension.
    nodes=[(side*.38,.46,-.12),(side*.43,.28,-.58),(side*.42,.27,.28)]
    for a,b in [(nodes[0],nodes[1]),(nodes[0],nodes[2]),(nodes[2],(side*.43,.136,0)),(nodes[2],(side*.43,.136,.58)),(nodes[1],(side*.43,.136,-.58))]:
        rod('rocker beam','mobility',a,b,.022,silver,8)
        cable('suspension wire','mobility',[(a[0]+side*.026,a[1]+.015,a[2]),(b[0]+side*.026,b[1]+.015,b[2])],.0025)
    for p in nodes:
        rod('bearing housing','mobility',(p[0]-.025,p[1],p[2]),(p[0]+.025,p[1],p[2]),.043,silver,24)
        ring('bearing seal','mobility',(p[0]+side*.026,p[1],p[2]),.031,.004,black)

# Mast with yaw barrel, collars, cable conduits and a four-aperture camera bar.
rod('mast column','instruments',(.05,.69,-.36),(.05,1.43,-.36),.039,white,40)
for y in [.72,.78,1.05,1.36]:
    rod('mast collar','instruments',(.05,y,-.36),(.05,y+.018,-.36),.045,silver,32)
box('mast foot','instruments',(.05,.72,-.36),(.16,.085,.13),white,.008)
rod('pan tilt barrel','instruments',(-.08,1.43,-.36),(.18,1.43,-.36),.068,white,40)
for x in [-.087,.187]:ring('pan tilt seal','instruments',(x,1.43,-.36),.052,.006,silver)
box('camera optical bench','instruments',(.05,1.481,-.375),(.35,.018,.08),silver,.003)
for x,r in [(-.09,.028),(-.025,.014),(.125,.014),(.19,.028)]:
    box('camera housing','instruments',(x,1.52,-.393),(.054,.070,.055),white,.003)
    rod('camera shade','instruments',(x,1.52,-.418),(x,1.52,-.451),r,black,32)
    rod('camera lens','instruments',(x,1.52,-.452),(x,1.52,-.453),r*.7,glass,32)
    ring('camera bezel','instruments',(x,1.52,-.451),r,.0025,silver,axis='z')
    for dx in [-.021,.021]:
        for dy in [-.028,.028]:rod('camera case screw','instruments',(x+dx,1.52+dy,-.422),(x+dx,1.52+dy,-.425),.0022,black,6)
    cable('camera flex harness','instruments',[(x,1.51,-.36),(x,1.49,-.32),(.05,1.46,-.30)],.002,gold)
for x in [-.088,.188]:
    for i in range(8):
        a=i*math.tau/8
        rod('tilt case bolt','instruments',(x,1.43+.047*math.sin(a),-.36+.047*math.cos(a)),(x+.003,1.43+.047*math.sin(a),-.36+.047*math.cos(a)),.0028,black,6)
rod('mast drive collar','instruments',(.05,.76,-.36),(.05,.802,-.36),.049,gold,40)
for side in [-1,1]:
    rod('mast mounting brace','instruments',(.05+side*.07,.69,-.33),(.05+side*.028,.79,-.35),.008,silver,12)
for i in range(3):
    cable('mast service loom','instruments',[(.095+i*.006,.7,-.35),(.115+i*.006,.8,-.35),(.093+i*.006,1.32,-.35),(.17,1.40,-.35),(.18,1.48,-.35)],.002)
for y in [.83,.97,1.12,1.27]:box('mast cable clamp','instruments',(.108,y,-.35),(.034,.01,.016),silver,.001)

# Articulated science arm displayed in a partially deployed reconstruction.
arm=[(-.19,.48,-.39),(-.26,.34,-.63),(-.23,.29,-.94),(-.15,.24,-1.08)]
for a,b in zip(arm,arm[1:]):
    rod('science arm tube','instruments',a,b,.021,silver,20)
    cable('arm harness','instruments',[(a[0]+.03,a[1],a[2]),(b[0]+.03,b[1],b[2])],.004)
for p in arm:
    rod('arm actuator','instruments',(p[0]-.032,p[1],p[2]),(p[0]+.032,p[1],p[2]),.041,white,24)
    for side in [-1,1]:
        ring('arm bearing seal','instruments',(p[0]+side*.033,p[1],p[2]),.028,.003,silver)
        for i in range(6):
            a=i*math.tau/6
            rod('arm bearing fastener','instruments',(p[0]+side*.033,p[1]+.032*math.sin(a),p[2]+.032*math.cos(a)),(p[0]+side*.036,p[1]+.032*math.sin(a),p[2]+.032*math.cos(a)),.0028,black,6)
box('instrument turret','instruments',(-.15,.22,-1.11),(.15,.105,.10),gold,.008)
rod('abrasion tool','instruments',(-.2,.20,-1.17),(-.2,.2,-1.21),.035,silver,24)
rod('microscopic imager','instruments',(-.11,.23,-1.17),(-.11,.23,-1.20),.023,black,24)

# Body service panels, actual geometry fasteners and externally routed harnesses.
for side in [-1,1]:
    x=side*.385
    for z in [-.30,-.08,.14]:
        box('equipment panel','body',(x,.46,z),(.012,.20,.19),gold,.004)
        for y in [.38,.54]:
            for zz in [z-.075,z+.075]:rod('panel bolt','body',(x,y,zz),(x+side*.012,y,zz),.0045,silver,6)
    for j in range(5):
        cable('body wiring loom','body',[(side*.30,.62,-.46),(side*(.42+j*.003),.59,-.3),(side*(.42+j*.003),.60,.12),(side*.32,.64,.37)],.0022)
    for z in [-.32,-.16,0,.16,.30]:box('harness clip','body',(side*.437,.60,z),(.012,.017,.008),blue,.001)
    for z in [-.4,.31]:rod('chassis corner strut','body',(side*.34,.31,z),(side*.34,.65,z),.016,silver)

# Array hinges/cable runs sit just above the source's thin solar deck.
# Fit discrete solar cells to the original deck silhouette, not a rectangular proxy.
deck=[]
for o in bpy.context.scene.objects:
    if o.type=='MESH' and o.get('assembly')=='power':
        verts=[o.matrix_world@v.co for v in o.data.vertices]
        deck.append(BVHTree.FromPolygons(verts,[list(p.vertices) for p in o.data.polygons]))
def deck_height(x,z):
    for tree in deck:
        hit,n,_,_=tree.ray_cast(pt((x,2,z)),Vector((0,0,-1)))
        if hit is not None and n.z>.8 and .64<hit.z<.73:return hit.z
    return None
for ix in range(-17,18):
    for iz in range(-6,9):
        x,z=ix*.064,iz*.102
        if abs(x)<.28 and z<.10:continue
        corners=[(x+dx,z+dz) for dx,dz in [(-.029,-.047),(.029,-.047),(.029,.047),(-.029,.047)]]
        hs=[deck_height(a,b) for a,b in corners]
        if any(h is None for h in hs) or max(hs)-min(hs)>.008:continue
        y=max(hs)+.0018
        # Cut corners distinguish photovoltaic wafers from generic checkerboard tiles.
        shape=[(-.026,-.047),(.026,-.047),(.029,-.043),(.029,.043),(.026,.047),(-.026,.047),(-.029,.043),(-.029,-.043)]
        mesh=bpy.data.meshes.new('Solar wafer');mesh.from_pydata([pt((x+a,y,z+b)) for a,b in shape],[],[list(reversed(range(8)))]);mesh.update()
        o=bpy.data.objects.new('power_Silicon wafer',mesh);bpy.context.collection.objects.link(o);o['assembly']='power';mesh.materials.append(cells[(ix+iz)%4])
        for dz in [-.046,.046]:
            box('cell interconnect','power',(x,y+.0003,z+dz),(.053,.0005,.0011),gold,0)
        for dx in [-.012,.012]:
            box('wafer electrode','power',(x+dx,y+.0004,z),(.00045,.0005,.091),silver,0)
for side in [-1,1]:
    for z in [-.39,.0,.39]:
        rod('array hinge','power',(side*.48,.711,z-.028),(side*.48,.711,z+.028),.009,silver)
    for j in range(3):
        cable('array bus harness','power',[(side*.15,.713,-.57+j*.006),(side*.42,.713,-.57+j*.006),(side*.73,.713,-.43+j*.006),(side*.95,.713,-.35+j*.006)],.0017)

# Convert curves then batch by assembly/material: detailed surfaces without hundreds of draw calls.
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
    if o.type in {'MESH','CURVE'}:o.select_set(True)
bpy.context.view_layer.objects.active=next(o for o in bpy.context.selected_objects if o.type=='MESH')
bpy.ops.object.convert(target='MESH')
batches={}
for o in list(bpy.context.scene.objects):
    if o.type=='MESH':batches.setdefault((o['assembly'],o.data.materials[0].name),[]).append(o)
for (part,m),objects in batches.items():
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:o.select_set(True)
    bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();o=bpy.context.object;o.name=part+'__'+m;o['assembly']=part

bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'spirit-refined.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/spirit-refined.glb'),export_format='GLB',export_extras=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
stats={'meshes':len(meshes),'triangles':sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes),'assemblies':sorted(set(o['assembly'] for o in meshes))}
(OUT/'spirit-refined.json').write_text(json.dumps(stats,indent=2))
print('MERSA_MODEL',json.dumps(stats))
