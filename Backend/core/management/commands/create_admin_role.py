from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Staff foydalanuvchini Content Administrator guruhiga biriktiradi."

    def add_arguments(self, parser):
        parser.add_argument('username', help='Mavjud Django foydalanuvchi username si')

    def handle(self, *args, **options):
        username = options['username']
        user_model = get_user_model()

        try:
            user = user_model.objects.get(username=username)
        except user_model.DoesNotExist as exc:
            raise CommandError(f"{username} foydalanuvchisi topilmadi.") from exc

        group, _ = Group.objects.get_or_create(name='Content Administrator')
        user.is_staff = True
        user.save(update_fields=['is_staff'])
        user.groups.add(group)
        self.stdout.write(self.style.SUCCESS(f"{username} Content Administrator guruhiga qo'shildi."))
