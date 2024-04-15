App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: function() {
        if(window.web3) {
            App.web3Provider=window.web3.currentProvider;
        } else {
            App.web3Provider=new Web3.proviers.HttpProvider('https://sepolia.infura.io/v3/c70084e7d5814f0fb5027ed79e11048f');
        }

        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function() {

        $.getJSON('product.json',function(data){

            var productArtifact=data;
            App.contracts.product=TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function() {

        $(document).on('click','.btn-register',App.getData);
    },

    getData:function(event) {
        event.preventDefault();
        var productSN = document.getElementById('productSN').value;
        var consumerCode = document.getElementById('consumerCode').value;
        var productInstance;
        //window.ethereum.enable();
        web3.eth.getAccounts(function(error,accounts){

            if(error) {
                console.log(error);
            }

            var account=accounts[0];
            // console.log(account);
            App.contracts.product.deployed().then(function(instance){

                productInstance=instance;
                return productInstance.verifyProduct(web3.fromAscii(productSN), web3.fromAscii(consumerCode),{from:account});

            }).then(function(result){
                
                // console.log(result);

                var t= "";

                var tr="<tr>";
                if(result){
                    tr+="<td>"+ "Genuine Product."+"</td>";
                }else{
                    tr+="<td>"+ "Fake Product."+"</td>";
                }
                tr+="</tr>";
                t+=tr;

                var ele=document.getElementById('logdata');
                document.getElementById('logdata').innerHTML = t;
                ele.style.fontWeight="bold";
                if(result)
                {
                    ele.style.color="green";
                }
                else
                {
                    ele.style.color="red";
                }
                
                document.getElementById('add').innerHTML=account;
           }).catch(function(err){
               console.log(err.message);
           })
        })
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    })
})