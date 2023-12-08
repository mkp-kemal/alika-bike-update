import axios from "axios";
import { useEffect, useState } from "react";

export function Test() {
    const [order, setOrder] = useState([]);
    const getDataOrder = async () => {
        // setIsloading(true);
        axios.get("https://alikabike.000webhostapp.com/midtrans.php")
            .then((response) => {
                setOrder(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getDataOrder();
    }, [])
    
    console.log(order);
    return (
        <div>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                {order.transaction_status}
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}