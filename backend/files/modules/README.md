
# Your modules folder

This folder contains your custom modules, and all URLs that are retrieving documents from a path starting
with _"/magic/modules/"_ will resolve to this module. This folder will also be used by e.g. the crudifier
as the destination folder for your HTTP CRUD and SQL endpoints.

You can also upload ZIP files here containing modules you've download somewhere and want to run in
your own server. However, please be careful as you do this, and make sure you never install something
not originating from a trusted source, since this might result in your server being infected by
malware. The _"Bazar"_ menu item will also unzip your dynamically installed Bazar apps into this
folder.

The default docker-compose.yml file mounts this folder as a volume, implying changes to this folder
will be persisted even if you update your Docker magic-backend image.
