export class ItemModel {
    id: String;
    name: String;
    description: String;
    image: [String];
    category: String;
	time:{
		start_time :Date,
		end_time : Date,
	};
	bid_price: {
		starting_bid : number,
		final_price: number
	};
	archive: Boolean;
	sold: Boolean;
}