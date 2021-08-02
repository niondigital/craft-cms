type AuthenticationStepHandler = () => AuthenticationRequest;

type AuthenticationRequest = {
    [key: string]: any
}

type AuthenticationAlternatives = {
    [key: string]: any
}

type AuthenticationResponse = {
    returnUrl?: string
    success?: boolean
    error?: string
    message?: string
    html?: string
    loginFormHtml?: string
    stepType?: string
    footHtml?: string
    stepComplete?: boolean
    alternatives?: AuthenticationAlternatives
}

class AuthenticationChainHandler
{
    readonly performAuthenticationEndpoint = 'authentication/perform-authentication';
    readonly startAuthenticationEndpoint = 'authentication/start-authentication';
    readonly loginHandler: LoginForm;

    private stepHandlers: {
        [key: string]: AuthenticationStepHandler
    } = {};

    public constructor(loginHandler: LoginForm)
    {
        this.loginHandler = loginHandler;
        this.attachListeners();
    }

    get $alternatives() { return $('#alternative-types');}
    get $authenticationStep() { return $('#authentication-step');}
    get $restartAuthentication() { return $('#restart-authentication');}
    get $startAuthentication() { return $('#start-authentication');}
    get $authenticationGreeting() { return $('#authentication-greeting');}

    /**
     * Attach relevant event listeners.
     *
     * @protected
     */
    protected attachListeners(): void
    {
        this.$alternatives.on('click', 'li', (ev) => {
            this.switchStep($(ev.target).attr('rel')!);
        });

        this.$restartAuthentication.on('click', (event) => {
            this.$authenticationStep.empty().attr('rel', '');
            this.$authenticationGreeting.remove();
            this.$startAuthentication.removeClass('hidden');

            event.preventDefault();
        });
    }
    /**
     * Register a step handler for a specific type
     *
     * @param stepType
     * @param handler
     */
    public registerStepHandler(stepType: string, handler: AuthenticationStepHandler)
    {
        this.stepHandlers[stepType] = handler;
    }

    /**
     * Perform the authentication step against the endpoint.
     *
     * @param {string} endpoint
     * @param {AuthenticationRequest} request
     */
    public performStep(endpoint: string, request: AuthenticationRequest): void
    {
        Craft.postActionRequest(endpoint, request, this.processResponse.bind(this));
    }

    /**
     * Switch the current authentication step to an alternative.
     *
     * @param stepType
     */
    public switchStep(stepType: string)
    {
        if (this.loginHandler.isDisabled()) {
            return;
        }
        this.loginHandler.disableForm();

        Craft.postActionRequest(this.performAuthenticationEndpoint, {
            stepType: stepType,
            switch: true
        }, this.processResponse.bind(this));
    }

    /**
     * Process authentication response.
     * @param response
     * @param textStatus
     * @protected
     */
    protected processResponse(response: AuthenticationResponse, textStatus: string)
    {
        if (textStatus == 'success') {
            if (response.success && response.returnUrl?.length) {
                window.location.href = response.returnUrl;
                // Keep the form disabled
                return;
            } else {
                if (response.error) {
                    this.loginHandler.showError(response.error);
                    Garnish.shake(this.loginHandler.$loginForm);
                }

                if (response.message) {
                    this.loginHandler.showMessage(response.message);
                }

                if (response.html) {
                    this.$authenticationStep.html(response.html);
                }

                if (response.loginFormHtml) {
                    this.loginHandler.$loginForm.html(response.loginFormHtml);
                    this.attachListeners();
                }

                if (response.alternatives && Object.keys(response.alternatives).length > 0) {
                    this.showAlternatives(response.alternatives);
                } else {
                    this.hideAlternatives();
                }

                if (response.stepType){
                    this.$authenticationStep.attr('rel', response.stepType);
                }

                if (response.footHtml) {
                    const jsFiles = response.footHtml.match(/([^"']+\.js)/gm);

                    const existingSources = Array.from(document.scripts).map(node => node.getAttribute('src')).filter(val => val && val.length > 0);

                    // For some reason, Chrome will fail to load sourcemap properly when jQuery append is used
                    // So roll our own JS file append-thing.
                    if (jsFiles) {
                        for (const jsFile of jsFiles) {
                            if (!existingSources.includes(jsFile)) {
                                let node = document.createElement('script');
                                node.setAttribute('src', jsFile)
                                document.body.appendChild(node);
                            }
                        }
                        // If that fails, use Craft's thing.
                    } else {
                        Craft.appendFootHtml(response.footHtml);
                    }
                }

                // Just in case this was the first step, remove all the misc things.
                if (response.stepComplete) {
                    this.loginHandler.$rememberMeCheckbox.parent().remove();
                    this.loginHandler.$cancelRecover.remove();
                    this.loginHandler.$recoverAccount.remove();
                }
            }
        }

        this.loginHandler.enableForm();
    }

    public showAlternatives(alternatives: AuthenticationAlternatives)
    {
        this.$alternatives.removeClass('hidden');
        const $ul = this.$alternatives.find('ul').empty();

        for (const [stepType, description] of Object.entries(alternatives)) {
            $ul.append($(`<li rel="${stepType}">${description}</li>`));
        }
    }

    public hideAlternatives()
    {
        this.$alternatives.addClass('hidden');
        this.$alternatives.find('ul').empty();
    }

    public handleFormSubmit (ev: any, additionalData: AuthenticationRequest) {
        this.invokeStepHandler(ev, additionalData)
    }

    /**
     * Invoke the current step handler bound to the authentication container
     * @param ev
     */
    protected async invokeStepHandler(ev: any, additionalData: AuthenticationRequest)
    {
        try {
            let requestData: AuthenticationRequest;

            if (this.isExistingChain()) {
                const stepType = this.$authenticationStep.attr('rel')!;
                const handler = this.stepHandlers[stepType];
                requestData = {...await handler(), ...additionalData};
            } else {
                requestData = additionalData;
            }

            if (this.loginHandler.isDisabled()) {
                return;
            }

            this.loginHandler.disableForm();
            this.performStep(this.isExistingChain() ? this.performAuthenticationEndpoint : this.startAuthenticationEndpoint, requestData);
        } catch (error) {
            this.loginHandler.showError(error)
            this.loginHandler.enableForm();
        }

    }

    public isExistingChain(): boolean
    {
        return this.$authenticationStep.attr('rel')!.length > 0;
    }

    public clearErrors()
    {
        this.loginHandler.clearErrors();
    }
}