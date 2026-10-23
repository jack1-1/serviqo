import { Directive, ViewContainerRef, TemplateRef, inject, effect, input } from "@angular/core";
import { AuthstateService } from "../../core/services/auth-state.service";
import { Permission } from "../../core/constants/permissions";
@Directive({
    selector: '[appHasPermission]',
    standalone: true
})

export class HasPermissionDirective {
    private readonly templateRef = inject(TemplateRef<unknown>);
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly authStateService = inject(AuthstateService);

    readonly appHasPermission = input.required<Permission>();
    private hasView = false;
    constructor() {
        effect(() => {
            const permission = this.appHasPermission();
            const hasPermission = this.authStateService.hasPermission(permission);
            if (hasPermission && !this.hasView) {

                this.viewContainer.createEmbeddedView(
                    this.templateRef
                );

                this.hasView = true;

            } else if (!hasPermission && this.hasView) {

                this.viewContainer.clear();

                this.hasView = false;
            }
        });
    }
}