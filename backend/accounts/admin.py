from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAdminCustom(UserAdmin):
    # 詳細
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "uid",
                    "email",
                    "password",
                    "name",
                    "avatar",
                    "introduction",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "updated_at",
                    "created_at",
                )
            },
        ),
    )

    # 追加
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "name",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )

    # 一覧
    list_display = (
        "uid",
        "email",
        "name",
        "is_active",
        "updated_at",
        "created_at",
    )

    list_filter = ()
    # 検索
    search_fields = (
        "uid",
        "email",
        "name",
    )
    # 順番
    ordering = ("-updated_at",)
    # リンク
    list_display_links = ("uid", "email", "name")
    # 編集不可
    readonly_fields = ("updated_at", "created_at", "uid")


admin.site.register(User, UserAdminCustom)
