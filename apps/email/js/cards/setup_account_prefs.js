/*global define*/
define(function(require) {

var templateNode = require('tmpl!./setup_account_prefs.html'),
    prefsMixin = require('./account_prefs_mixins'),
    mix = require('mix'),
    evt = require('evt'),
    mozL10n = require('l10n!'),
    common = require('mail_common'),
    Cards = common.Cards;

/**
 * Setup is done; add another account?
 */
function SetupAccountPrefsCard(domNode, mode, args) {
  this.domNode = domNode;
  this.account = args.account;
  this.identity = this.account.identities[0];

  // Establish defaults specifically for our email app.
  this.identity.modifyIdentity({ signatureEnabled: true,
    signature: mozL10n.get('settings-default-signature') });

  this.signature = this.nodeFromClass('signature-button');
  this.signature.textContent = this.identity.signature;
  this.signature.addEventListener('click', this.onClickSignature.bind(this),
    false);

  this.nextButton = this.nodeFromClass('sup-info-next-btn');
  this.nextButton.addEventListener('click', this.onNext.bind(this), false);

  this._bindPrefs('tng-account-check-interval',
                  'tng-notify-mail',
                  'tng-sound-onsend',
                  'tng-signature-input');
}

SetupAccountPrefsCard.prototype = {
  onNext: function(event) {
    Cards.pushCard(
      'setup_done', 'default', 'animate',
      {});
  },

  onCardVisible: function() {
    // This forces the card to immediately update when the user
    // returns from the signature input card, even if the backend
    // has not updated the identity yet
    this.signature.textContent = this.identity.signature;
  },

  onClickSignature: function(index) {
   Cards.pushCard(
      'settings_signature', 'default', 'animate',
      {
        account: this.account,
        index: index
      },
      'right');
  },

  die: function() {
  }
};

// Wire up some common pref handlers.
mix(SetupAccountPrefsCard.prototype, prefsMixin);

Cards.defineCardWithDefaultMode(
    'setup_account_prefs',
    { tray: false },
    SetupAccountPrefsCard,
    templateNode
);

return SetupAccountPrefsCard;

});
