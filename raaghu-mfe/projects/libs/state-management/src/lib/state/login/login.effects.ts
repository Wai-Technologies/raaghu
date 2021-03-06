import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AccountServiceProxy, HostDashboardServiceProxy, ProfileServiceProxy, SessionServiceProxy } from "projects/libs/shared/src/lib/service-proxies";
import { from, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { getCurrentLoginInformation, getCurrentLoginInformationFailure, getCurrentLoginInformationSuccess, GetProfilePicture, GetProfilePictureFailure, GetProfilePictureSuccess, GetSubscriptionExpiringData, GetSubscriptionExpiringDataFailure, GetSubscriptionExpiringDataSuccess, ValidateTenantName, ValidateTenantNameFailure, ValidateTenantNameSuccess } from "./login.actions";



@Injectable()
export class LoginEffects {
    constructor(
        private actions$: Actions,
        private AccountService: AccountServiceProxy,
        private _sessionService: SessionServiceProxy,
        private GetSubscriptionExpiringDataProxy: HostDashboardServiceProxy,
        private GetProfilePictureProxy: ProfileServiceProxy,
        private store: Store) {

    }

    selectedPermissions = []

    validateTenantName$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ValidateTenantName),
            switchMap(({ tenancyName }) =>

                // Call the getTodos method, convert it to an observable
                from(this.AccountService.isTenantAvailable(tenancyName)).pipe(
                    // Take the returned value and return a new success action containing the todos
                    map((ValidatetenantI) => {
                        return ValidateTenantNameSuccess({ ValidatetenantState: ValidatetenantI, tenancyName })
                    }),
                    // Or... if it errors return a new failure action containing the error
                    catchError((error) => of(ValidateTenantNameFailure({ error })))
                )
            )
        )
    );
}