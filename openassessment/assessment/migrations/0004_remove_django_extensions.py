# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessment', '0003_expand_course_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trackchanges',
            name='owner_submission_uuid',
            field=models.UUIDField(default=uuid.uuid4, db_index=True),
        ),
    ]
