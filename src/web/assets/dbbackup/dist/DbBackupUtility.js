!function(){var t;t=jQuery,Craft.DbBackupUtility=Garnish.Base.extend({$trigger:null,$form:null,init:function(r){this.$form=t("#"+r),this.$trigger=t("input.submit",this.$form),this.$status=t(".utility-status",this.$form),this.addListener(this.$form,"submit","onSubmit")},onSubmit:function(r){var e=this;r.preventDefault(),this.$trigger.hasClass("disabled")||(this.progressBar?this.progressBar.resetProgressBar():this.progressBar=new Craft.ProgressBar(this.$status),this.progressBar.$progressBar.removeClass("hidden"),this.progressBar.$progressBar.velocity("stop").velocity({opacity:1},{complete:function(){t("#download-backup").prop("checked")?Craft.downloadFromUrl("POST",Craft.getActionUrl("utilities/db-backup-perform-action"),e.$form.serialize()).then((function(){e.updateProgressBar(),setTimeout(e.onComplete.bind(e),300)})).catch((function(){Craft.cp.displayError(Craft.t("app","There was a problem backing up your database. Please check the Craft logs.")),e.onComplete(!1)})):Craft.sendActionRequest("POST","utilities/db-backup-perform-action").then((function(t){e.updateProgressBar(),setTimeout(e.onComplete.bind(e),300)})).catch((function(t){t.response,e.updateProgressBar(),Craft.cp.displayError(Craft.t("app","There was a problem backing up your database. Please check the Craft logs.")),e.onComplete(!1)}))}}),this.$allDone&&this.$allDone.css("opacity",0),this.$trigger.addClass("disabled"),this.$trigger.trigger("blur"))},updateProgressBar:function(){this.progressBar.setProgressPercentage(100)},onComplete:function(r){var e=this;this.$allDone||(this.$allDone=t('<div class="alldone" data-icon="done" />').appendTo(this.$status),this.$allDone.css("opacity",0)),this.progressBar.$progressBar.velocity({opacity:0},{duration:"fast",complete:function(){void 0!==r&&!0!==r||e.$allDone.velocity({opacity:1},{duration:"fast"}),e.$trigger.removeClass("disabled"),e.$trigger.trigger("focus")}})}})}();
//# sourceMappingURL=DbBackupUtility.js.map