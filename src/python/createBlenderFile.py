import bpy
import sys
argv = sys.argv
argv=argv[argv.index("--") + 1:]

path=argv[0]
filename=argv[1]
mode=argv[2]
tmptype=argv[3]


if tmptype == "DEFAULT":
    if mode == "GENERAL":
        bpy.ops.wm.read_homefile(app_template="")
    elif mode == "SCULPT":
        bpy.ops.wm.read_homefile(app_template="Sculpting")
    elif mode == "ANIM_2D":
        bpy.ops.wm.read_homefile(app_template="2D_Animation")
    elif mode == "VFX":
        bpy.ops.wm.read_homefile(app_template="VFX")
    elif mode == "VIDEO_EDITING":
        bpy.ops.wm.read_homefile(app_template="Video_Editing")

bpy.ops.wm.save_as_mainfile(filepath=path+"\\"+filename+".blend")