export const helpers = {
    isset: (varToCheck) => {
      if (
        typeof varToCheck !== undefined &&
        varToCheck !== null &&
        varToCheck !== "" &&
        varToCheck !== undefined
      ) {
        if (Array.isArray(varToCheck)) {
          if (varToCheck.length > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    formatDate(string){
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }
  };
  