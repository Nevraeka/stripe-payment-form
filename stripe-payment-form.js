Polymer({

    is: 'stripe-payment-form',

    properties : {

      /*
      * Server end point for form post
      */
      registerController: {
        type: String,
        value: "/reg_controller"
      },

      /*
      * Publishable Key for active Stripe account
      */
      publishKey: {
        type: String,
        value: "pk_test_rs0z1w1ewZOyXpl0E8eWFj5V"
      }

    },

    attached: function(){
      this._loadStripe();
      this._stripe();
    },

    /**
     *
     */
    disable: function() {
      return this.$.submit.disabled = true;
    },

    enable: function() {
      return this.$.submit.disabled = false;
    },

    showError: function(error) {
      this.$.error.innerHTML = error;
      this.enable();
      return error;
    },

    _send: function(status, response){
      var xhr = this.$.xhr;
      if(status == 200){
        this.enable();
        this.$.token.value = response.id;
        xhr.body = this._encodedRegisterData();
        xhr.url  = this.registerController;
      }
    },

    _registerData: function() {
        return [].map.call(this.$.form.querySelectorAll('input[name]'), this._mapStripeElements);
    },

    _responseHandler: function(status, response) {
      if(response.error){
        return this.showError(response.error.message);
      }
      this._send(status, response);
      this.fire('paymentProcessed', { response: response, status: status, data: this._registerData() });
    },

    _paymentHandler: function(evt){
      evt.preventDefault();
      this.disable();
      Stripe.card.createToken(this.$.form, this._responseHandler.bind(this));
      return false;
    },

    _stripe: function(){
      if(this._stripeExists()){
        Stripe.setPublishableKey(this.publishKey);
        this.$.form.addEventListener('submit', this._paymentHandler.bind(this), false);
      } else {
        setTimeout(this.stripe.bind(this),0);
      }
    },

    _stripeExists: function(){
      return Stripe && (typeof Stripe != "undefined");
    },

    _loadStripe: function(){
      var script = document.createElement('script');
      script.src = "https://js.stripe.com/v2/";
      document.body.appendChild(script);
    },

    _encodedRegisterData: function(){
      return encodeURIComponent(this._registerData().join('&'));
    },

    _mapStripeElements: function(item) {
        return item.name + '=' + item.value;
    }
});
