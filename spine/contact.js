(function(global){
    //Model
    //�½�
    var Contact = Spine.Model.setup("Contact", [firstName, lastName, email]);
    //���뱾�ش洢
    Contact.extend(Spine.Model.Local);
    //���ʵ������
    Contact.include({
        fullName : function () {
            if (!this.fullName && !this.lastName) { return; }
            return this.fullName + " " + this.lastName;
        }
    });
    
    //Control
    $(function($) {
        var Sidebar = Spine.Control.create({
            elements: {
                ".items": this.items
            },
            events : {
                "click button" : this.create
            },
            proxied: ["render"],
            template: function (items) {
                return $("#contactTemplate").tmpl(items);
            },
            init: function () {
                this.list = Spine.List.init({
                    el : this.items,
                    template: this.template
                });
                
                this.list.bind("change", this.proxy(function(item) {
                    this.App.trigger("show:contact", item);
                }));
                
                this.App.bind("show:contact edit:contact", this.list.change);
                
                Contact.bind("refresh change" , this.render);
            },
            render: function () {
                var items = Contact.all();
                this.list.render(items);
            },
            create: function () {
                var item = Contact.create();
                this.app.trigger("edit:contact", item);
            }
        });
    });
    
    
    //View
})(this);