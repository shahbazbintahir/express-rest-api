class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // if u want to get the data using query object(Filtering)
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((field) => delete queryObj[field]);
    //in this we we have to set url manually [lte] or [gt]
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    //ascending sort=property
    //descending sort=-property
    if (this.queryString.sort) {
      //if sorting on multiple multiple
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // this.query= this.query.sort(this.queryString.sort)
    } 
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
