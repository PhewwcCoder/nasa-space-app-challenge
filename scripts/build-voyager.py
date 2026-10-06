"""Prepare NASA/VTAD Voyager in Blender; preserve source geometry and UVs.
Teaching assembly cuts and PBR adjustments are not engineering disassembly.
"""
import bpy,json,math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/voyager-nasa.glb'))
# The exporter root contains an invisible utility cube, not spacecraft hardware.
root=bpy.data.objects.get('_root')
if root and root.type=='MESH': bpy.data.objects.remove(root,do_unlink=True)
import bmesh
report=[]
for o in list(bpy.context.scene.objects):
 if o.type!='MESH': continue
 bpy.context.view_layer.update()
 vertices=[o.matrix_world@v.co for v in o.data.vertices]
 parent=list(range(len(vertices)))
 def find(i):
  while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
  return i
 for edge in o.data.edges:
  a,b=edge.vertices;parent[find(a)]=find(b)
 islands={}
 for i,v in enumerate(vertices):islands.setdefault(find(i),[]).append(i)
 assignment={}
 for indices in islands.values():
  c=sum((vertices[i] for i in indices),Vector())/len(indices)
  part='mobility' if o.name=='tex_02_AO' or c.z>1.1 and abs(c.x)<2.1 and abs(c.y)<2.1 else 'power' if c.y<-1.6 and c.z<1.1 else 'instruments' if c.y>1.5 or c.z>3 else 'body'
  for i in indices:assignment[i]=part
 for part in set(assignment.values()):
  mesh=o.data.copy();bm=bmesh.new();bm.from_mesh(mesh);bm.verts.ensure_lookup_table()
  bmesh.ops.delete(bm,geom=[v for v in bm.verts if assignment[v.index]!=part],context='VERTS');bm.to_mesh(mesh);bm.free()
  obj=bpy.data.objects.new(part+'_'+o.name,mesh);bpy.context.collection.objects.link(obj);obj.matrix_world=o.matrix_world.copy();obj['assembly']=part
  report.append({'part':part,'faces':len(mesh.polygons)})
 bpy.data.objects.remove(o,do_unlink=True)
 print('Prepared assembly batches:',len(report),flush=True)
for m in bpy.data.materials:
 if not m.use_nodes:continue
 bs=m.node_tree.nodes.get('Principled BSDF')
 if bs:bs.inputs['Roughness'].default_value=.42;bs.inputs['Metallic'].default_value=.45
# Merge by assembly and material to retain a small number of draw calls.
for o in list(bpy.context.scene.objects):
 if o.type!='MESH':continue
 bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
groups={}
for o in list(bpy.context.scene.objects):
 if o.type=='MESH':groups.setdefault((o.get('assembly','body'),o.data.materials[0].name if o.data.materials else ''),[]).append(o)
for (part,mat),objs in groups.items():
 bpy.ops.object.select_all(action='DESELECT')
 for o in objs:o.select_set(True)
 bpy.context.view_layer.objects.active=objs[0];bpy.ops.object.join();objs[0].name=part+'_'+mat;objs[0]['assembly']=part
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/blender/voyager-refined.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/voyager-refined.glb'),export_format='GLB',export_extras=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
(ROOT/'assets/blender/voyager-refined.json').write_text(json.dumps({'source':'NASA/VTAD Voyager.glb','assemblies':list(set(x['part'] for x in report)),'triangles':sum(len(o.data.polygons) for o in bpy.context.scene.objects if o.type=='MESH'),'mesh_batches':len(groups),'adaptation':'Preserved geometry/UV; assembly grouping, metallic/roughness adjustment; no exact CAD claim'},indent=2))
# Local QA render, not shipped as evidence.
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24
scene.world=bpy.data.worlds.new('Space');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.07,.09,.13,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.6
for loc,power,size in [((4,-3,9),2200,8),((-5,1,5),1700,7),((2,8,1),1300,6)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(13,-19,13));cam=bpy.context.object;cam.rotation_euler=(Vector((0,-3,2))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=21;scene.camera=cam
scene.render.resolution_x=1300;scene.render.resolution_y=900;scene.render.resolution_percentage=100;scene.render.filepath=str(ROOT/'docs/qa/voyager-blender.png');bpy.ops.render.render(write_still=True)
