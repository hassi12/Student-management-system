from django.contrib import admin

from .models import Department, Batch, Semester, ClassSection

admin.site.register(Department)
admin.site.register(Batch)
admin.site.register(Semester)
admin.site.register(ClassSection)