import bpy
import math
import os

# Clear existing objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

def create_pbr_material(name, base_color):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base_color
        bsdf.inputs['Roughness'].default_value = 0.4
    return mat

def create_bamboo_stalk():
    # Base parameters
    segments = 8
    radius = 0.08
    height = 5.0
    segment_height = height / segments
    
    # Create main cylinder
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=radius, depth=height)
    stalk = bpy.context.active_object
    stalk.name = "Bamboo_Stalk"
    
    # Apply bamboo material
    mat = create_pbr_material("Bamboo_Mat", (0.1, 0.4, 0.15, 1))
    stalk.data.materials.append(mat)
    
    # Add loop cuts for segments and scale them slightly to mimic bamboo nodes
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    
    # Simple curvature via simple deform modifier
    bpy.ops.object.mode_set(mode='OBJECT')
    mod = stalk.modifiers.new(name="Bend", type='SIMPLE_DEFORM')
    mod.deform_method = 'BEND'
    mod.angle = math.radians(10)
    
    # Shade smooth
    bpy.ops.object.shade_smooth()
    return stalk

def create_bamboo_leaf():
    bpy.ops.mesh.primitive_plane_add(size=1.0)
    leaf = bpy.context.active_object
    leaf.name = "Bamboo_Leaf"
    
    # Scale to leaf shape
    leaf.scale = (0.2, 0.8, 1.0)
    
    # Add curvature via deform
    mod = leaf.modifiers.new(name="Bend", type='SIMPLE_DEFORM')
    mod.deform_method = 'BEND'
    mod.angle = math.radians(45)
    mod.deform_axis = 'Z'
    
    # Apply material
    mat = create_pbr_material("Leaf_Mat", (0.15, 0.5, 0.1, 1))
    leaf.data.materials.append(mat)
    
    # Shade smooth
    bpy.ops.object.shade_smooth()
    return leaf

# Generate and Export Stalk
stalk = create_bamboo_stalk()
bpy.context.view_layer.objects.active = stalk
stalk.select_set(True)

output_dir = os.path.abspath(os.path.join(bpy.path.abspath("//"), "public", "models"))
os.makedirs(output_dir, exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=os.path.join(output_dir, "bamboo.glb"),
    use_selection=True,
    export_format='GLB'
)

# Clean up
bpy.ops.object.delete()

# Generate and Export Leaf
leaf = create_bamboo_leaf()
bpy.context.view_layer.objects.active = leaf
leaf.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=os.path.join(output_dir, "leaf.glb"),
    use_selection=True,
    export_format='GLB'
)

print(f"Generated GLB files successfully in {output_dir}")
