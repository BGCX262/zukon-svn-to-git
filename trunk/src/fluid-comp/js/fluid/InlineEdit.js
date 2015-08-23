fluid=fluid||{};(function($,fluid){function setCaretToStart(control){if(control.createTextRange){var range=control.createTextRange();range.collapse(true);range.select()}else{if(control.setSelectionRange){control.focus();control.setSelectionRange(0,0)}}}function edit(that){var viewEl=that.viewEl;var displayText=viewEl.text();that.updateModel(displayText===that.options.defaultViewText?"":displayText);that.editField.width(Math.max(viewEl.width()+that.options.paddings.edit,that.options.paddings.minimumEdit));viewEl.removeClass(that.options.styles.invitation);viewEl.removeClass(that.options.styles.focus);viewEl.hide();that.editContainer.show();if(that.tooltipEnabled()){$("#"+that.options.tooltipId).hide()}setTimeout(function(){that.editField.focus();if(that.options.selectOnEdit){that.editField[0].select()}else{setCaretToStart(that.editField[0])}},0)}function clearEmptyViewStyles(textEl,defaultViewStyle,originalViewPadding){textEl.removeClass(defaultViewStyle);textEl.css("padding-right",originalViewPadding)}function showDefaultViewText(that){that.viewEl.text(that.options.defaultViewText);that.viewEl.addClass(that.options.styles.defaultViewText)}function showNothing(that){that.viewEl.text("");if($.browser.msie){if(that.viewEl.css("display")==="inline"){that.viewEl.css("display","inline-block")}}if(that.existingPadding<that.options.paddings.minimumView){that.viewEl.css("padding-right",that.options.paddings.minimumView)}}function showEditedText(that){that.viewEl.text(that.model.value);clearEmptyViewStyles(that.viewEl,that.options.defaultViewStyle,that.existingPadding)}function finish(that){if(that.options.finishedEditing){that.options.finishedEditing(that.editField[0],that.viewEl[0])}that.updateModel(that.editField.val());that.editContainer.hide();that.viewEl.show()}function makeEditHandler(that){return function(){edit(that);return false}}function bindHoverHandlers(viewEl,invitationStyle){var over=function(evt){viewEl.addClass(invitationStyle)};var out=function(evt){viewEl.removeClass(invitationStyle)};viewEl.hover(over,out)}function bindMouseHandlers(that){bindHoverHandlers(that.viewEl,that.options.styles.invitation);that.viewEl.click(makeEditHandler(that))}function bindKeyHighlight(viewEl,focusStyle,invitationStyle){var focusOn=function(){viewEl.addClass(focusStyle);viewEl.addClass(invitationStyle)};var focusOff=function(){viewEl.removeClass(focusStyle);viewEl.removeClass(invitationStyle)};viewEl.focus(focusOn);viewEl.blur(focusOff)}function bindKeyboardHandlers(that){that.viewEl.tabbable();bindKeyHighlight(that.viewEl,that.options.styles.focus,that.options.styles.invitation);that.viewEl.activatable(makeEditHandler(that))}function bindEditFinish(that){var finishHandler=function(evt){var code=(evt.keyCode?evt.keyCode:(evt.which?evt.which:0));if(code!==$.a11y.keys.ENTER){return true}finish(that);that.viewEl.focus();return false};that.editContainer.keypress(finishHandler)}function bindBlurHandler(that){var blurHandler=function(evt){finish(that);return false};that.editField.blur(blurHandler)}function aria(viewEl,editContainer){viewEl.ariaRole("button")}var bindToDom=function(that,container){that.viewEl=that.locate("text");that.editContainer=$(that.options.selectors.editContainer,that.container);if(that.editContainer.length>=1){var isEditSameAsContainer=that.editContainer.is(that.options.selectors.edit);var containerConstraint=isEditSameAsContainer?that.container:that.editContainer;that.editField=$(that.options.selectors.edit,containerConstraint)}else{var editElms=that.options.editModeRenderer(that);that.editContainer=editElms.container;that.editField=editElms.field}};var defaultEditModeRenderer=function(that){var editModeTemplate="<span><input type='text' class='edit'/></span>";var editContainer=$(editModeTemplate);var editField=jQuery("input",editContainer);var componentContainerId=that.container.attr("id");if(componentContainerId){var editContainerId=componentContainerId+"-edit-container";var editFieldId=componentContainerId+"-edit";editContainer.attr("id",editContainerId);editField.attr("id",editFieldId)}editField.val(that.model.value);that.container.append(editContainer);return{container:editContainer,field:editField}};var setupInlineEdit=function(componentContainer,that){bindToDom(that,componentContainer);var padding=that.viewEl.css("padding-right");that.existingPadding=padding?parseFloat(padding):0;that.updateModel(that.viewEl.text());bindMouseHandlers(that);bindKeyboardHandlers(that);bindEditFinish(that);bindBlurHandler(that);aria(that.viewEl,that.editContainer);that.editContainer.hide();var initTooltip=function(){if(that.tooltipEnabled()){$(componentContainer).tooltip({delay:that.options.tooltipDelay,extraClass:that.options.styles.tooltip,bodyHandler:function(){return that.options.tooltipText},id:that.options.tooltipId})}};jQuery(initTooltip)};fluid.inlineEdit=function(componentContainer,userOptions){var that=fluid.initView("inlineEdit",componentContainer,userOptions);that.model={value:""};that.modelFirer=fluid.event.getEventFirer();that.edit=function(){edit(that)};that.finish=function(){finish(that)};that.tooltipEnabled=function(){return that.options.useTooltip&&$.fn.tooltip};that.render=function(source){if(that.model.value){showEditedText(that)}else{if(that.options.defaultViewText){showDefaultViewText(that)}else{showNothing(that)}}if(that.editField&&that.editField.index(source)===-1){that.editField.val(that.model.value)}};that.updateModel=function(newValue,source){var change=that.model.value!==newValue;if(change){that.model.value=newValue;that.modelFirer.fireEvent(newValue)}that.render(source)};setupInlineEdit(componentContainer,that);fluid.initDecorators(that);return that};var setupInlineEdits=function(editables,options){var editors=[];editables.each(function(idx,editable){editors.push(fluid.inlineEdit(jQuery(editable),options))});return editors};fluid.inlineEdits=function(componentContainer,options){options=options||{};var selectors=$.extend({},fluid.defaults("inlineEdits").selectors,options.selectors);var container=fluid.container(componentContainer);var editables=$(selectors.editables,container);return setupInlineEdits(editables,options)};fluid.defaults("inlineEdit",{selectors:{text:".text",editContainer:".editContainer",edit:".edit"},styles:{invitation:"inlineEdit-invitation",defaultViewText:"inlineEdit-invitation-text",tooltip:"inlineEdit-tooltip",focus:"inlineEdit-focus"},paddings:{edit:10,minimumEdit:80,minimumView:60},editModeRenderer:defaultEditModeRenderer,defaultViewText:"Click here to edit",tooltipText:"Click item to edit",tooltipId:"tooltip",useTooltip:false,tooltipDelay:2000,selectOnEdit:false});fluid.defaults("inlineEdits",{selectors:{editables:".inlineEditable"}})})(jQuery,fluid);