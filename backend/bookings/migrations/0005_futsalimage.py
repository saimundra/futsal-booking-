# Generated manually

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0004_add_map_link_to_futsal'),
    ]

    operations = [
        migrations.CreateModel(
            name='FutsalImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='futsal_gallery/')),
                ('caption', models.CharField(blank=True, max_length=200)),
                ('is_featured', models.BooleanField(default=False)),
                ('display_order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('futsal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='bookings.futsal')),
            ],
            options={
                'db_table': 'futsal_images',
                'ordering': ['display_order', '-created_at'],
            },
        ),
    ]
