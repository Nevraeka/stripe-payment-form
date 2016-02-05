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
      * Server end point for form post
      */
      publishKey: {
        type: String,
        value: "pk_test_rs0z1w1ewZOyXpl0E8eWFj5V"
      }
    },

    attached: function(){
      this.stripe();
    },

    stripe: function(){
      if(this._stripeExists()){
        Stripe.setPublishableKey(this.publishKey);
        this.$.form.addEventListener('submit', this.paymentHandler.bind(this), false);
      } else {
        this.stripe();
      }
    },

    disable: function() {
      this.$.submit.disabled = true;
    },

    enable: function() {
      this.$.submit.disabled = false;
    },

    registerData: function() {
        return [].map.call(this.$.form.querySelectorAll('input[name]'), this._mapStripeElements);
    },

    showError: function(error) {
        this.$.error.innerHTML = error;
        this.enable();
    },

    send: function(status, response){
      var xhr = this.$.xhr;
      if(status == 200){
        this.$.token.value = response.id;
        xhr.body = this._encodedRegisterData();
        xhr.url  = this.registerController;
      }
    },

    responseHandler: function(status, response) {
      if(response.error){
        return this.showError(response.error);
      }
      this.send(status, response);
      this.fire('paymentProcessed', { response: response, status: status, data: this.registerData() });
    },

    _stripeExists: function(){
      return window.Stripe && (typeof window.Stripe != "undefined");
    },

    paymentHandler: function(){
      this.disable();
      Stripe.card.createToken(this.$.form, this.responseHandler.bind(this));
      return false;
    },

    _encodedRegisterData: function(){
      return encodeURIComponent(this.registerData().join('&'));
    },

    _mapStripeElements: function(item) {
        return item.name + '=' + item.value;
    }
});
