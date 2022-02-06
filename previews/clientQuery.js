
let demoClientOptions = {
    sort: 'createdAt, isDeleted',
    limit: '8',
    page: '5',
    fields: 'title, cover, author, shortDescription',
    price: { gte: '345' },
    rating: { gt: '4.5' }
}