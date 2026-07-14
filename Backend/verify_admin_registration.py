import os
import sys
import django

def main():
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')
    try:
        django.setup()
    except Exception as e:
        print(f"Error setting up Django: {e}", file=sys.stderr)
        sys.exit(1)

    from django.apps import apps
    from django.contrib import admin

    # Get all concrete models in core
    try:
        core_config = apps.get_app_config('core')
    except LookupError:
        print("Error: core app not found in installed apps.", file=sys.stderr)
        sys.exit(1)

    all_models = core_config.get_models()
    concrete_models = [model for model in all_models if not model._meta.abstract]

    # Get all standalone registered models
    registered_standalone = set(admin.site._registry.keys())

    # Get all inline registered models
    registered_inlines = set()
    for model, model_admin in admin.site._registry.items():
        if hasattr(model_admin, 'inlines') and model_admin.inlines:
            for inline_class in model_admin.inlines:
                if hasattr(inline_class, 'model'):
                    registered_inlines.add(inline_class.model)

    all_registered_models = registered_standalone.union(registered_inlines)

    missing_models = []
    registered_models_found = []

    for model in concrete_models:
        if model in all_registered_models:
            reg_type = []
            if model in registered_standalone:
                reg_type.append("standalone")
            if model in registered_inlines:
                reg_type.append("inline")
            registered_models_found.append(f"{model.__name__} ({', '.join(reg_type)})")
        else:
            missing_models.append(model.__name__)

    print("--- Model Registration Audit ---")
    print(f"Total concrete models defined in core: {len(concrete_models)}")
    print(f"Total registered models found (standalone or inline): {len(all_registered_models)}")
    
    print("\nRegistered Models:")
    for item in sorted(registered_models_found):
        print(f" - {item}")

    if missing_models:
        print("\nFAILURE: Some concrete models are not registered in admin:")
        for missing in sorted(missing_models):
            print(f" - {missing}")
        sys.exit(1)
    else:
        print("\nSUCCESS: All concrete models defined in core/models.py are registered in Django Admin!")
        sys.exit(0)

if __name__ == '__main__':
    main()
